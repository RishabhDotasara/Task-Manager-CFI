import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isSubmitting: boolean;
}

export function CommentForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  isSubmitting,
}: CommentFormProps) {
  return (
    <div className="w-full space-y-2">
      <Textarea
        placeholder="Add a comment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={onSubmit} disabled={isSubmitting || isLoading}>
        Post Comment
        {isSubmitting && <Loader2 className="animate-spin ml-2" />}
      </Button>
    </div>
  );
}