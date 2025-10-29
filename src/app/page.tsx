import { CreateTodoForm } from "@/features/todo/components/create-todo-form";
import { TodoItemList } from "@/features/todo/components/todo-item-list";
import db from "@/lib/db";

export default async function Page() {
  const todos = await db.todo.findMany();
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <h1 className='text-3xl font-extrabold text-center mb-6'>Todo List</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 justify-center'>
        <CreateTodoForm />
        <TodoItemList todos={todos} />
      </div>
    </div>
  );
}
