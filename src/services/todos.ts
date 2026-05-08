import { Todo, TodoList } from "../../types/todo";
import { TodoFromForm } from "../lib/todoSchema";
import { mutate } from "swr";

export async function handleAddTodo(newTodo: TodoFromForm) {
  const todo = { ...newTodo, status: "Open" };
  const response = await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify(todo),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    mutate("/api/todos");
  }
}

export async function handleDeleteTodo(idToDelete: string) {
  const response = await fetch(`/api/todos/${idToDelete}`, {
    method: "DELETE",
  });
  if (response.ok) {
    mutate("/api/todos");
  }
}

export async function handleEditTodo(updatedTodo: Todo) {
  const response = await fetch(`/api/todos/${updatedTodo.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedTodo),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    mutate("/api/todos");
  }
}

export async function handleToggleStatus(todo: Todo) {
  const updatedTodo = { ...todo, status: todo.status === "Done" ? "Open" : "Done" };

  await mutate(
    "/api/todos",
    async (currentTodos: TodoList | undefined) => {
      await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: { "Content-Type": "application/json" },
      });
      return (currentTodos ?? []).map((currentTodo) => (currentTodo.id === todo.id ? updatedTodo : currentTodo));
    },
    {
      optimisticData: (currentTodos: TodoList | undefined) =>
        (currentTodos ?? []).map((currentTodo) => (currentTodo.id === todo.id ? updatedTodo : currentTodo)),
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    },
  );
}

export async function handleResetTodoStatus() {
  const response = await fetch("/api/todos", {
    method: "PATCH",
  });
  if (response.ok) {
    mutate("/api/todos");
  }
}
