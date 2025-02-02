import { initialTodos, columnNames } from "@/utils/todos";
import { useState } from "react";
import { Todo, TodoFromForm, TodoList } from "../../types/todo";
import { nanoid } from "nanoid";
import { DragEndEvent } from "@dnd-kit/core";

export function useTodos() {
  const [todos, setTodos] = useState<TodoList>(initialTodos);

  function handleAddTodo(newTodo: TodoFromForm) {
    const todo = { ...newTodo, status: "Open", id: nanoid() };
    setTodos([...todos, todo]);
  }

  function handleEditTodo(updatedTodo: Todo) {
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  }

  function handleDeleteTodo(idToDelete: string) {
    setTodos(todos.filter((todo) => todo.id !== idToDelete));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active, collisions } = event;

    if (!over) return;

    const filteredCollisions = collisions?.filter((collision) =>
      columnNames.includes(collision.id as string)
    );

    if (!filteredCollisions?.length) return;

    const activeId = active.id;

    setTodos((prevTodos: TodoList) => {
      return prevTodos.map((todo) =>
        todo.id === activeId
          ? { ...todo, column: filteredCollisions[0].id as string }
          : todo
      );
    });
  }

  return {
    handleAddTodo,
    handleEditTodo,
    handleDeleteTodo,
    todos,
    handleDragEnd,
  };
}
