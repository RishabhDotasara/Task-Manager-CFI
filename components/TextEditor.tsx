import React, { useCallback, useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "@/lib/firebase";
import { io } from "socket.io-client";
import {
  CollaborativeEditingHandler,
  DocumentEditorContainerComponent,
  Toolbar,
  WordExport,
  DocumentEditor,
  Inject,
} from "@syncfusion/ej2-react-documenteditor";

import "../app/editor.css";

import { registerLicense } from "@syncfusion/ej2-base";
import { Socket } from "dgram";
import { useSession } from "next-auth/react";
registerLicense(
  "ORg4AjUWIQA/Gnt2U1hhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5bdkNiW35ac3VRT2da"
);

const debounce = (
  func: { (showPopup: any, args: any): Promise<void>; apply?: any },
  delay: number | undefined
) => {
  let timer: string | number | NodeJS.Timeout | undefined;
  return function (...args: any) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

type Props = {
  preUrl: string;
  fileName: string;
  fileId: string;
  mimetype: string;
};

export default function TextEditor({
  preUrl,
  fileName,
  fileId,
  mimetype,
}: Props) {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const session = useSession();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [socket, setSocket] = useState<any>();
  const [collaborativeEditingHandler, setCollaborativeEditingHandler] =
    useState<CollaborativeEditingHandler>();
  const userId = session.data?.userId;

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_REALTIME_SERVER_URL!);

    setSocket(s);

    s.emit("join-room", fileId, userId);

    return () => {
      s.disconnect();
    };
  }, [fileId, userId]);

  useEffect(() => {
    if (editorRef.current && preUrl?.trim() !== "") {
      const fetchAndExtractContent = async (wordFileUrl: string) => {
        try {
          // Fetch the Word file
          const response = await fetch(wordFileUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch the Word file");
          }

          // Convert response to blob
          const blob = await response.blob();
          const file = new File([blob], fileName, {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          editorRef.current?.documentEditor.open(file);
        } catch (error) {
          console.error("Error fetching and extracting content:", error);
        }
      };
      fetchAndExtractContent(preUrl);

      handleKeyBoardShortcuts();

      DocumentEditor.Inject(CollaborativeEditingHandler);
      editorRef.current.documentEditor.enableCollaborativeEditing = true;
      console.log(
        "Collaborative editing enabled:",
        editorRef.current.documentEditor.collaborativeEditingHandlerModule
      );
    }
  }, [preUrl, isEditorReady, fileName]);

  useEffect(() => {
    console.log("Socket connected:", socket);
    socket?.on("receive-changes", (delta: any) => {
      console.log("Received changes:", delta);
      collaborativeEditingHandler?.applyRemoteAction("action", {
        operations: delta,
        connectionId: fileId,
        currentUser: userId,
      });
    });

    return () => {
      if (socket) {
        socket.off("receive-changes");
      }
    };
  }, [collaborativeEditingHandler, fileId, userId, socket, editorRef.current]);

  function handleKeyBoardShortcuts() {
    if (!editorRef.current) return;
    editorRef.current.documentEditor.keyDown = function (args) {
      const keyCode = args.event.which || args.event.keyCode;
      const isCtrlKey =
        args.event.ctrlKey || args.event.metaKey
          ? true
          : keyCode === 17
          ? true
          : false;

      if (isCtrlKey && keyCode === 83) {
        //To prevent default save operation, set the isHandled property to true
        args.isHandled = true;

        editorRef.current?.documentEditor.save(
          fileName.split(".").slice(0, -1).join("."),
          "Docx"
        );

        args.event.preventDefault();
      }
    };
  }

  // Save document to Firebase Storage
  const saveDocument = useCallback(
    async (showPopup: any) => {
      if (!isEditorReady) return;

      const document = await editorRef.current?.documentEditor.saveAsBlob(
        "Docx"
      );

      if (!document) {
        console.error("Failed to generate document blob.");
        return;
      }

      const file = document;

      const fileRef = ref(storage, `files/${userId}/${fileId}`);

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("File upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEditorReady, fileId, mimetype, userId, socket]
  );

  // Create a debounced version of the saveDocument function
  const debouncedSaveDocument = useCallback(debounce(saveDocument, 300), [
    saveDocument,
  ]);

  const toolItem = {
    prefixIcon: "e-save icon",
    tooltipText: "Save the Document",
    text: "Save",
    id: "save",
  };
  const items = [
    toolItem,
    "New",
    "Open",
    "Separator",
    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "InsertFootnote",
    "InsertEndnote",
    "Separator",
    "Find",
    "Separator",
    "Comments",
    "TrackChanges",
    "Separator",
    "LocalClipboard",
    "RestrictEditing",
    "Separator",
    "FormFields",
    "UpdateFields",
    "ContentControl",
  ];

  const onToolbarClick = (args: { item: { id: any } }) => {
    switch (args.item.id) {
      case "save":
        saveDocument(true);
        break;
      default:
        break;
    }
  };

  function onCreated() {
    setIsEditorReady(true);

    setCollaborativeEditingHandler(
      editorRef.current?.documentEditor.collaborativeEditingHandlerModule
    );
  }

  return (
    <>
      <DocumentEditorContainerComponent
        id="container"
        height={"68vh"}
        width="70vw"
        serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
        enableToolbar={true}
        ref={editorRef}
        toolbarItems={items as any}
        toolbarClick={onToolbarClick}
        created={onCreated}
        contentChange={(args) => {
          if (args) {
            console.log("Content changed:", args);
            socket.emit("send-changes", args.operations);
          }
          debouncedSaveDocument(false, args);
        }}
        currentUser={userId}
      >
        <Inject services={[Toolbar, WordExport]} />
      </DocumentEditorContainerComponent>
    </>
  );
}
