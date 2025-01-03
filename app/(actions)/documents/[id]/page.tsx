"use client";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import React, { use, useEffect } from "react";
import { Document } from "../page";
import { useSession } from "next-auth/react";
import TextEditor from "@/components/TextEditor";
import CustomFileViewer from "@/components/CustomFileViewer";
import { useSearchParams } from "next/navigation";

export default function DocumentEditor({ params }: { params: { id: string } }) {
  const session = useSession();
  const [document, setDocument] = React.useState<Document | null>(null);
  const [presignedUrl, setPresignedUrl] = React.useState<string | null>(null);
  const searchParams = useSearchParams();

  const ownerId = searchParams.get("ownerId");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const { fileInfo, presignedUrl } = await getDocument(
          params.id,
          ownerId || session?.data?.userId
        );
        setPresignedUrl(presignedUrl);
        setDocument(fileInfo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDocument();
  }, [params.id, session]);

  if (!document) {
    return <div>Loading...</div>;
  }

  switch (document.mimetype) {
    case "application/pdf":
      return (
        <iframe
          src={presignedUrl!}
          className="w-full h-screen"
          title={document.name}
        ></iframe>
      );

    case "image/jpeg":
    case "image/png":
    case "image/jpg":
    case "image/gif":
    case "image/webp":
      return (
        <img src={presignedUrl!} className="h-[50vh]" alt={document.name} />
      );

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
      return (
        <TextEditor
          fileId={document.id}
          fileName={document.name}
          mimetype={document.mimetype}
          preUrl={presignedUrl!}
        />
      );
  }

  return <CustomFileViewer fileName={document.name} preUrl={presignedUrl!} />;
}

const getDocument = async (fileId: string, userId: string) => {
  try {
    const res = await fetch(`/api/file/getPresignedUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId, userId }),
    });

    const data = await res.json();

    const collectionRef = collection(db, "files");
    const docRef = doc(collectionRef, fileId);
    const firebaseDoc = await getDoc(docRef);

    // Check if the document exists
    if (!firebaseDoc.exists()) {
      throw new Error("Document not found");
    }

    // Build the fileInfo object
    const fileInfo: Document = {
      id: firebaseDoc.id, // Explicitly assign the document ID
      ...firebaseDoc.data(),
    } as Document;

    // Authorization check
    if (
      fileInfo.ownerId !== userId &&
      fileInfo.sharedWith?.indexOf(userId) === -1
    ) {
      throw new Error("You are not authorized to view this document");
    }

    const presignedUrl = data.url;

    return { fileInfo, presignedUrl };
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};
