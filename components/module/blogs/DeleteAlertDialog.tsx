"use client";

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
import { Trash2 } from "lucide-react";

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteAlertDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  isLoading,
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            You are about to permanently delete{" "}
            <span className="font-semibold text-neutral-700">"{title}"</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel disabled={isLoading}>Keep Article</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-rose-500 hover:bg-rose-600"
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
