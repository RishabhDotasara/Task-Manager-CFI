"use client";


export const dynamic = "force-dynamic"

import React, { useEffect, useRef, useState } from "react";
import {
  FiVideo,
  FiPhone,
  FiSend,
  FiPaperclip,
  FiChevronDown,
  FiUser,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Role } from "@prisma/client";

interface Contact {
  userId: string;
  role: Role;
  employeeId: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: any;
}


export default function ChatPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const session = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = session.data?.userId;

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/user/getAll");
        const data = await res.json();

        // Remove current user from contacts
        const filteredData = data.filter((contact: Contact) => {
          return contact.userId !== currentUserId;
        });
        setContacts(filteredData);
        setSelectedContact(filteredData[0]);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  // Listen for real-time messages in Firestore
  useEffect(() => {
    if (selectedContact) {
      const chatId = getChatId(currentUserId, selectedContact.userId);
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [selectedContact, currentUserId]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatId = (user1: string, user2: string) => {
    return [user1, user2].sort().join("_"); // Ensure chatId is consistent for both users
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && selectedContact) {
      const chatId = getChatId(currentUserId, selectedContact.userId);

      try {
        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: currentUserId,
          content: message,
          timestamp: new Date(),
        });

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <FiUser className="w-6 h-6 text-gray-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-semibold">
                {selectedContact ? selectedContact.employeeId : "Select a chat"}
                <FiChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {contacts.map((contact) => (
                <DropdownMenuItem
                  key={contact.userId}
                  onSelect={() => setSelectedContact(contact)}
                >
                  {contact.employeeId}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-x-2">
          {selectedContact && (
            <>
              <Link href={`/video-call?otherUserId=${selectedContact.userId}`}>
                <Button size="icon" variant="ghost">
                  <FiVideo className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="icon" variant="ghost">
                <FiPhone className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-[48vh]">
          <div className="space-y-4 pr-4">
            {selectedContact ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message flex ${
                    msg.senderId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`box-border ${
                      msg.senderId === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    } rounded-lg py-2 px-4 max-w-[75%] break-words`}
                  >
                    <p className="whitespace-pre-wrap max-w-xs lg:max-w-md">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No chat selected</p>
              </div>
            )}
            {/* Empty div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <Button type="button" size="icon" variant="ghost">
            <FiPaperclip className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <FiSend className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
