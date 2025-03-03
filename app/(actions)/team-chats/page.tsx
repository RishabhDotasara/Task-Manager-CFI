"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  PersonStanding,
  Send,
  UserCircle,
  Users,
  UsersIcon,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { teamAtom } from "@/states/teamAtom";
import { Message, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import ReloadButton from "@/components/ReloadButton";

const members = [
  {
    id: 1,
    name: "Alice",
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Bob",
    online: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Charlie",
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "David",
    online: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Eve",
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function ChatUI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>();
  const queryClient = useQueryClient();
  const currentTeamId = useRecoilValue(teamAtom);
  const session = useSession();
  const userId = session.data?.userId;
  const [teamMembers, setTeamMembers] = useState<User[] | undefined>(undefined);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [exp, setExp] = useState(1);

  const createMessageMutation = useMutation({
    mutationKey: ["messages", currentTeamId, selectedMember?.userId],
    onMutate: async () => {
      const newMessage: any = {
        content: input,
        senderId: userId,
        receiverId: selectedMember?.userId,
      };
      setMessages((prev) => [
        ...(prev ? prev : []),
        { ...newMessage, id: prev ? prev.length + 1 : 1 },
      ]);
      setInput("");
      const res = await fetch("/api/message/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
      if (!res.ok) {
        toast({
          title: "Failure Sending Message!",
          description: "Please check you internet connection.",
        });
      }
    },
  });

  const fetchChatMessagesQuery = useQuery({
    queryKey: ["messages", currentTeamId, selectedMember?.userId],
    queryFn: async () => {
      try {
        const res = await fetch(
          "/api/message/get?senderId=" +
            userId +
            "&receiverId=" +
            selectedMember?.userId +
            "&exp=" +
            exp
        );
        const data = await res.json();
        console.log(data);
        setMessages(data.messages);
        return data;
      } catch (err) {
        console.log("Error fetching messages: ");
        toast({
          title: "Error fetching messages",
          description: "Please check your internet connection.",
        });
      }
    },
    staleTime: 1 * 60 * 1000,
    enabled: Boolean(selectedMember) || Boolean(exp),
    refetchOnWindowFocus: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const getUsersQuery = useQuery({
    queryKey: ["users", currentTeamId],
    queryFn: async () => {
      // if (session.data?.role == Role.MEMBER) return;
      try {
        const response = await fetch(
          "/api/users/getAll?teamId=" + currentTeamId
        );
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.users);
          setSelectedMember(null);
          return data.users;
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "Error Fetching Users",
          variant: "destructive",
        });
      }
    },
    enabled: Boolean(currentTeamId),
  });

  if (!currentTeamId) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-2xl text-muted-foreground font-semibold">
        Select a team to chat with members
      </div>
    );
  }

  return (
    <div className="flex w-full h-[600px] bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-background border-r">
        <div className="p-4 font-semibold flex gap-2">
          <Users className="text-primary" />
          Team Members
        </div>
        <ScrollArea className="">
          {teamMembers?.map(
            (member: User) =>
              member.userId != userId && (
                <Button
                  key={member.userId}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-4 py-2",
                    selectedMember?.userId === member.userId && "bg-accent"
                  )}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-center w-full">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={member.avatar} alt={member.username} />
                      <AvatarFallback>{member.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="flex-grow text-left">
                      {member.username}
                    </span>
                    {/* <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    member.online ? "bg-green-500" : "bg-gray-300"
                  )}
                /> */}
                  </div>
                </Button>
              )
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {!selectedMember && (
        <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-muted-foreground">
          Select a user to chat with
        </div>
      )}
      {selectedMember && (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-background p-4 shadow flex justify-between">
            <div className="flex items-center w-fit">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                  src={selectedMember?.avatar}
                  alt={selectedMember?.username}
                />
                <AvatarFallback>{selectedMember?.username[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{selectedMember?.username}</span>
              {/* <span
              className={cn(
                "w-2 h-2 rounded-full ml-2",
                selectedMember?.online ? "bg-green-500" : "bg-gray-300"
              )}
            /> */}
            </div>
            <ReloadButton
              isRefetching={fetchChatMessagesQuery.isRefetching}
              onRefetch={fetchChatMessagesQuery.refetch}
              tooltipText="Refresh Messages!"
            />
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {fetchChatMessagesQuery.isLoading && (
              <Loader2 className="animate-spin mb-4" />
            )}
            {!setSelectedMember && (
              <div className="text-center">
                <UserCircle className="text-primary" /> Select a user to chat
                with
              </div>
            )}
            {fetchChatMessagesQuery.data && (
              <Button
                variant={"ghost"}
                className="mb -4 "
                onClick={() => {
                  setExp((prev) => prev + 1);
                }}
              >
                Load More
              </Button>
            )}
            {messages?.map((m: Message) => (
              <div
                key={m.id}
                className={cn(
                  "flex mb-4",
                  m.senderId === userId ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[70%]",
                    m.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-accent"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMessageMutation.mutate();
            }}
            className="bg-background p-4 flex gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={`Message ${selectedMember?.username}...`}
              className="flex-1"
            />
            <Button type="submit">
              <Send />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
