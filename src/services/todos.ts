import { Todo, TodoFromForm } from "../../types/todo";
import { DragEndEvent } from "@dnd-kit/core";
import { columnNames } from "@/utils/todos";
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

export async function handleDragEnd(event: DragEndEvent) {
  const { over, active, collisions } = event;

  if (!over) return;

  const filteredCollisions = collisions?.filter((collision) =>
    columnNames.includes(collision.id as string)
  );

  if (!filteredCollisions?.length) return;

  const activeId = active.id;

  const response = await fetch(`/api/todos/${activeId}`, {
    method: "PATCH",
    body: JSON.stringify({ column: filteredCollisions[0].id as string }),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    mutate("/api/todos");
  }
}
