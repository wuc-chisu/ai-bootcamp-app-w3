"use client";

import type { Todo, User } from "../../../../generated/prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, CheckCircle2Icon, CircleIcon } from "lucide-react";

interface TodoDetailsDialogProps {
  todo: Todo & { createdByUser?: User };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TodoDetailsDialog = ({
  todo,
  open,
  onOpenChange,
}: TodoDetailsDialogProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            {todo.completed ? (
              <CheckCircle2Icon className="size-6 text-green-600" />
            ) : (
              <CircleIcon className="size-6 text-gray-400" />
            )}
            {todo.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Status:
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                todo.completed
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {todo.completed ? "Completed" : "In Progress"}
            </span>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            {todo.description ? (
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {todo.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description provided
              </p>
            )}
          </div>

          <Separator />

          {/* Created By User */}
          {todo.createdByUser && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created By
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={todo.createdByUser.image || undefined}
                      alt={todo.createdByUser.name}
                    />
                    <AvatarFallback>
                      {todo.createdByUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {todo.createdByUser.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {todo.createdByUser.email}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span className="font-medium">Created</span>
              </div>
              <p className="text-sm pl-6">{formatDate(todo.createdAt)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span className="font-medium">Last Updated</span>
              </div>
              <p className="text-sm pl-6">{formatDate(todo.updatedAt)}</p>
            </div>
          </div>

          <Separator />

          {/* Todo ID */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              Todo ID
            </h3>
            <p className="text-xs font-mono bg-muted px-3 py-2 rounded">
              {todo.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
