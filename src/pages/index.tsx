import { useState } from "react";
import { Todo, TodoFromForm, TodoList } from "../../types/todo";
import { nanoid } from "nanoid";
import Form from "@/components/Form/Form";
import Column from "@/components/Column/Column";
import styles from "@/styles/Home.module.css";
import Modal from "@/components/Modal/Modal";

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
  const [isOpen, setIsOpen] = useState(false);

  function handleAddTodo(newTodo: TodoFromForm) {
    const todo = { ...newTodo, status: "Open", id: nanoid() };
    setTodos([...todos, todo]);
  }

  function handleToggleModal() {
    setIsOpen(!isOpen);
  }

  function handleEditTodo(updatedTodo: Todo) {
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Weekly Planner</h1>
      <div className={styles.columnWrapper}>
        {columnNames.map((column, index) => {
          const filteredTodos = todos.filter((todo) => todo.column === column);
          return (
            <Column
              key={index}
              name={column}
              todos={filteredTodos}
              onEditTodo={handleEditTodo}
            />
          );
        })}
      </div>

      <button
        type="button"
        aria-label="open form to add todo"
        onClick={handleToggleModal}
        disabled={isOpen}
        className={styles.button}
      >
        +
      </button>

      {isOpen && (
        <Modal onClose={handleToggleModal}>
          <Form
            onAddTodo={(newTodo) => {
              handleAddTodo(newTodo);
              handleToggleModal();
            }}
          />
        </Modal>
      )}
    </>
  );
}
