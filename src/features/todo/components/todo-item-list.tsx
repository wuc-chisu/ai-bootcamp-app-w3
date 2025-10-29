"use client";

import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { Todo } from "../../../../generated/prisma/client";
import { deleteTodo, toggleTodoComplete } from "../server/actions";
import { EditTodoDialog } from "./edit-todo-dialog";
import { TodoDetailsDialog } from "./todo-details-dialog";

export const TodoItemList = ({ todos }: { todos: Todo[] }) => {
  return (
    <div className='flex w-full min-w-sm max-w-lg flex-col gap-4 h-80 overflow-y-auto px-3'>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTodo(todo.id);
      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Failed to delete todo");
      }
    });
  };

  const handleToggleComplete = (checked: boolean) => {
    startTransition(async () => {
      const result = await toggleTodoComplete(todo.id, checked);
      if (result?.success) {
        toast.success(result.message);
        setIsChecked(!isChecked);
      } else {
        toast.error(result?.message || "Failed to update todo");
      }
    });
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // Don't open details if clicking on checkbox, buttons, or dropdown
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[role="checkbox"]') ||
      target.closest('[role="menu"]')
    ) {
      return;
    }
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className='flex w-full min-w-sm max-w-lg flex-col gap-6'>
      <Item
        variant='outline'
        className='w-full cursor-pointer hover:bg-muted/50 transition-colors'
        onClick={handleItemClick}
      >
        <ItemMedia>
          <Checkbox
            checked={isChecked}
            onCheckedChange={handleToggleComplete}
            disabled={isPending}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className={isChecked ? "line-through opacity-60" : ""}>
            {todo.title}
          </ItemTitle>
          {todo.description && (
            <ItemDescription className='line-clamp-2'>
              {todo.description}
            </ItemDescription>
          )}
        </ItemContent>
        <ItemActions>
          <EditTodoDialog
            todo={todo}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}>
            <div />
          </EditTodoDialog>
          <TodoDetailsDialog
            todo={todo}
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' disabled={isPending}>
                <MoreVerticalIcon className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <PencilIcon className='size-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} variant='destructive'>
                <TrashIcon className='size-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>
    </div>
  );
};
