import { useState } from "react";
import { TodoFromForm, TodoList } from "../../types/todo";
import { nanoid } from "nanoid";

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

function Form({ onAddTodo }: { onAddTodo: (newTodo: TodoFromForm) => void }) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    onAddTodo(data as TodoFromForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        maxWidth: "400px",
        gap: "1rem",
      }}
    >
      <label htmlFor="title">Titel*</label>
      <input name="title" id="title" type="text" required aria-required />
      <label>
        Wochentag*
        <select required aria-required name="column">
          <option value="Backlog">Backlog</option>
          <option value="Montag">Montag</option>
          <option value="Dienstag">Dienstag</option>
          <option value="Mittwoch">Mittwoch</option>
          <option value="Donnerstag">Donnerstag</option>
          <option value="Freitag">Freitag</option>
          <option value="Samstag">Samstag</option>
          <option value="Sonntag">Sonntag</option>
        </select>
      </label>
      <label htmlFor="notes">weitere Notizen</label>
      <textarea rows={5} name="notes" id="notes"></textarea>
      <button
        type="submit"
        style={{ alignSelf: "center", padding: "1rem 0.75rem" }}
      >
        Add Todo
      </button>
    </form>
  );
}
