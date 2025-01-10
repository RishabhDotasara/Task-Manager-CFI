import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ToolTip from "@/components/tooltip";
import { Comment } from "@prisma/client";
import { User } from "lucide-react";

interface CommentListProps {
  comments: Comment[] | undefined;
  isLoading: boolean;
}

export function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
      </>
    );
  }

  if ((comments && comments.length === 0) || !comments) {
    return <h1>No Comments</h1>;
  }

  return (
    <>
      {comments &&
        comments.map((comment: Comment) => (
          <div key={comment.commentId} className="flex space-x-4">
            <Avatar>
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              {/* <ToolTip text={(comment?.author as any).employeeId}>
              
            </ToolTip> */}
              <p className="text-sm font-medium text-muted-foreground hover:text-foreground">
                {(comment?.author as any).username}
              </p>
              <p className="text-sm text">{comment.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
    </>
  );
}
