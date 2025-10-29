"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import superjson from "superjson";
import type { Todo } from "../../../../generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateTodoSchemaType } from "@/features/todo/utils/schemas";
import { UpdateTodoSchema } from "@/features/todo/utils/schemas";
import { updateTodo } from "../server/actions";

interface EditTodoDialogProps {
  todo: Todo;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditTodoDialog = ({
  todo,
  children,
  open,
  onOpenChange,
}: EditTodoDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateTodoSchemaType>({
    resolver: zodResolver(UpdateTodoSchema),
    defaultValues: {
      id: todo.id,
      title: todo.title,
      description: todo.description || "",
      completed: todo.completed,
    },
  });

  const submitHandler = async (data: UpdateTodoSchemaType) => {
    const dataString = superjson.stringify(data);
    startTransition(async () => {
      const result = await updateTodo(dataString);
      if (result?.success) {
        toast.success(result.message);
        onOpenChange?.(false);
      } else {
        toast.error(result?.message || "Failed to update todo");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <form id="edit-todo-form" onSubmit={form.handleSubmit(submitHandler)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    type="text"
                    {...field}
                    data-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    {...field}
                    data-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-todo-form" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save
            Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
