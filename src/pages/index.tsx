import { useState } from "react";
import { TodoList } from "../../types/todo";

const initialTodos: TodoList = [
  {
    id: "1",
    title: "Briefe",
    column: "Donnerstag",
    status: "Done",
  },
  {
    id: "2",
    title: "Saugen",
    column: "Donnerstag",
    status: "Open",
  },
  {
    id: "3",
    title: "Splid",
    column: "Freitag",
    status: "Done",
  },
  {
    id: "4",
    title: "Splid",
    column: "Samstag",
    status: "Open",
  },
];

export default function Home() {
  const [todos, setTodos] = useState<TodoList>(initialTodos);
  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Weekly Planner</h1>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          flexDirection: "column",
          width: "10vw",
          gap: "1rem",
        }}
      >
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ padding: "1rem", border: "2px solid var(--foreground)" }}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </>
  );
}
