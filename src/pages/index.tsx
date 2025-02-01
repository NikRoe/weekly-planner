import { useState } from "react";
import { TodoFromForm, TodoList } from "../../types/todo";
import { nanoid } from "nanoid";
import Form from "@/components/Form";

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

const columnNames = [
  "Backlog",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

export default function Home() {
  const [todos, setTodos] = useState<TodoList>(initialTodos);

  function handleAddTodo(newTodo: TodoFromForm) {
    const todo = { ...newTodo, status: "Open", id: nanoid() };
    setTodos([...todos, todo]);
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Weekly Planner</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, minmax(10px, 1fr))",
        }}
      >
        {columnNames.map((column, index) => {
          const filteredTodos = todos.filter((todo) => todo.column === column);
          return (
            <ul
              key={index}
              style={{
                display: "flex",
                listStyle: "none",
                flexDirection: "column",
                width: "10vw",
                gap: "1rem",
              }}
            >
              <h2>{column}</h2>
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    padding: "1rem",
                    border: "2px solid var(--foreground)",
                  }}
                >
                  {todo.title}
                </li>
              ))}
            </ul>
          );
        })}
      </div>
      <Form onAddTodo={handleAddTodo} />
    </>
  );
}
