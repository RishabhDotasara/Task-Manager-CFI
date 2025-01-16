"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeletionConfirmationDialogProps {
  title?: string;
  description?: string;
  triggerText?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeletionConfirmationDialog({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  triggerText,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  isPending = false,
}: DeletionConfirmationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size={"sm"}>
          <Trash2 />
          {triggerText ? triggerText : null}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {confirmText}{" "}
            {isPending && <Loader2 className="animate-spin h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
