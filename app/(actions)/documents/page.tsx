"use client";

import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  File,
  FileText,
  Image,
  Music,
  Video,
  MoreVertical,
  Share,
  Info,
  Trash2,
  Upload,
  Search,
  Check,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export type Document = {
  id: string;
  name: string;
  mimetype:
    | "application/pdf"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "image/jpeg"
    | "image/png"
    | "application/msword"
    | "audio"
    | "video"
    | "image/jpg"
    | "image/gif"
    | "image/webp";
  url: string;
  ownerId: string;
  createdAt?: Date;
  sharedWith?: string[];
};

type User = {
  userId: string;
  employeeId: string;
  isAdmin: boolean;
};

const getIcon = (mimetype: Document["mimetype"]) => {
  switch (mimetype) {
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <FileText className="w-6 h-6" />;
    case "image/jpeg":
    case "image/png":
      return <Image className="w-6 h-6" />;
    case "audio":
      return <Music className="w-6 h-6" />;
    case "video":
      return <Video className="w-6 h-6" />;
    default:
      return <File className="w-6 h-6" />;
  }
};

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [receivedDocuments, setReceivedDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [activeTab, setActiveTab] = useState<"my-files" | "received">(
    "my-files"
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const session = useSession();
  const { toast } = useToast();
  // @ts-ignore
  const userId: string = session.data?.userId;

  useEffect(() => {
    if (!userId) return;

    // Realtime listener for owned documents
    const unsubscribeOwned = onSnapshot(
      query(collection(db, "files"), where("ownerId", "==", userId)),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Document[];

        setDocuments(docs);
      },
      (error) => {
        console.error("Error fetching owned documents:", error);
      }
    );

    // Realtime listener for shared documents
    const unsubscribeShared = onSnapshot(
      query(
        collection(db, "files"),
        where("sharedWith", "array-contains", userId)
      ),
      (snapshot) => {
        const sharedDocs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Document[];

        setReceivedDocuments(sharedDocs);
      },
      (error) => {
        console.error("Error fetching shared documents:", error);
      }
    );

    // Cleanup the listeners on unmount
    return () => {
      unsubscribeOwned();
      unsubscribeShared();
    };
  }, [userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user/getAll");
      const userData = await res.json();
      // Remove the current user from the list
      const filteredUserData = userData.filter(
        (user: User) => user.userId !== userId
      );
      setUsers(filteredUserData);
    };

    fetchUsers();
  }, [session]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      console.log(`Uploading file: ${file.name}`);
      const fileId = uuidv4(); // Generate a unique ID for the file

      try {
        // 1. Upload file to Firebase Storage
        const fileRef = ref(storage, `files/${userId}/${fileId}`); // Use fileId in the path to avoid name conflicts
        const snapshot = await uploadBytes(fileRef, file); // Upload the file to the reference
        console.log("File uploaded to Firebase Storage.");

        // 2. Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(`File available at: ${downloadURL}`);

        // 3. Save the file data to Firestore with the same fileId as document ID
        const docRef = doc(db, "files", fileId); // Explicitly set the document ID to fileId
        await setDoc(docRef, {
          name: file.name,
          mimetype: file.type,
          url: downloadURL, // Store the download URL from Firebase Storage
          ownerId: userId,
          createdAt: new Date(), // Optional: Add a timestamp
        });

        toast({
          title: "File uploaded",
          description: `Successfully uploaded ${file.name}`,
        });

        setIsShareModalOpen(false);

        console.log("File details saved to Firestore.");
      } catch (error) {
        toast({
          title: "File upload failed",
          description: "An error occurred while uploading the file.",
          variant: "destructive",
        });
        console.error(
          "Error during file upload or Firestore operation:",
          error
        );
      }
    }
  };

  const handleShare = (doc: Document) => {
    setSelectedDocument(doc);
    setSelectedUsers(
      doc.sharedWith
        ? users.filter((user) => doc.sharedWith?.includes(user.userId))
        : []
    );
    setIsShareModalOpen(true);
  };

  const shareDocument = async () => {
    if (!selectedDocument) return;

    const docRef = doc(db, "files", selectedDocument.id);

    try {
      // Update the document with the selected users
      await setDoc(docRef, {
        ...selectedDocument,
        sharedWith: selectedUsers.map((user) => user.userId),
      });

      toast({
        title: "Document shared",
        description: `Successfully shared ${selectedDocument.name} with selected users.`,
      });

      setIsShareModalOpen(false);
    } catch (error) {
      toast({
        title: "Sharing failed",
        description: "An error occurred while sharing the document.",
        variant: "destructive",
      });
      console.error("Error during Firestore operation:", error);
    }
  };

  const handleInfo = (doc: Document) => {
    console.log(`Viewing info for ${doc.name}`);
    // Implement info view functionality
  };

  const handleDelete = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDocument) {
      try {
        // Reference to the document in Firestore
        const docRef = doc(db, "files", selectedDocument.id);
        // Reference to the file in Firebase Storage
        const fileRef = ref(storage, `files/${userId}/${selectedDocument.id}`);

        // Delete the document from Firestore
        await deleteDoc(docRef);

        // Delete the file from Firebase Storage
        await deleteObject(fileRef);

        toast({
          title: "File Deleted",
          description: `Successfully deleted ${selectedDocument.name}`,
        });
      } catch (error) {
        console.error("Error deleting document or file:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the document or file.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const filteredUsers = users.filter((user) =>
    user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.userId === user.userId)
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user]
    );
  };

  const renderDocumentItem = (doc: Document) => (
    <div
      key={doc.id}
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
    >
      <Link
        href={`/documents/${doc.id}?ownerId=${doc.ownerId}`}
        className="flex items-center"
      >
        <div className="mr-4 text-gray-500">{getIcon(doc.mimetype)}</div>
        <h2 className="text-md font-semibold max-w-[10%] text-ellipsis">
          {doc.name}
        </h2>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare(doc)}>
            <Share className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleInfo(doc)}>
            <Info className="mr-2 h-4 w-4" />
            <span>Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(doc)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col  h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="relative">
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleUpload}
            multiple
          />
          <Label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Label>
        </div>
      </div>
      <Tabs defaultValue="my-files" className="w-full">
        <TabsList className="grid w-1/2 grid-cols-2">
          <TabsTrigger
            value="my-files"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            onClick={() => setActiveTab("my-files")}
          >
            My Files
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            onClick={() => setActiveTab("received")}
          >
            Received Files
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-files" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map(renderDocumentItem)}
          </div>
        </TabsContent>
        <TabsContent value="received" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {receivedDocuments.map(renderDocumentItem)}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Share {selectedDocument?.name}</DialogTitle>
            <DialogDescription>
              Search and select users to share this document with.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <ScrollArea className="h-36 w-full rounded-md border overflow-y-auto p-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.employeeId}
                  className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer rounded-md"
                  onClick={() => toggleUserSelection(user)}
                >
                  <span>{user.employeeId}</span>
                  {selectedUsers.some((u) => u.userId === user.userId) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </ScrollArea>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm flex items-center"
                >
                  {user.employeeId}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2 text-primary-foreground hover:text-primary"
                    onClick={() => toggleUserSelection(user)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={shareDocument}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{selectedDocument?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
