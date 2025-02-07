import { Todo, TodoFromForm } from "../../types/todo";
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

export async function handleResetTodoStatus() {
  const response = await fetch("/api/todos", {
    method: "PATCH",
  });
  if (response.ok) {
    mutate("/api/todos");
  }
}
