import { useState } from "react";
import { Todo, TodoFromForm, TodoList } from "../../types/todo";
import { nanoid } from "nanoid";
import Form from "@/components/Form/Form";
import Column from "@/components/Column/Column";
import styles from "@/styles/Home.module.css";
import Modal from "@/components/Modal/Modal";
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

const initialTodos: TodoList = [
  {
    id: "12",
    title: "Briefe",
    column: "Donnerstag",
    status: "Done",
  },
  {
    id: "23",
    title: "Saugen",
    column: "Donnerstag",
    status: "Open",
  },
  {
    id: "34",
    title: "Splid",
    column: "Freitag",
    status: "Done",
  },
  {
    id: "214",
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

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(pointerSensor);

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

  function handleDeleteTodo(idToDelete: string) {
    setTodos(todos.filter((todo) => todo.id !== idToDelete));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active, collisions } = event;

    if (!over) return;

    const filteredCollisions = collisions?.filter((collision) =>
      columnNames.some((name) => name === collision.id)
    );

    if (!filteredCollisions) return;

    const { id: activeId } = active;

    // @ts-ignore
    setTodos((prevTodos: TodoList) => {
      return prevTodos.map((todo) =>
        todo.id === activeId
          ? { ...todo, column: filteredCollisions[0].id }
          : todo
      );
    });
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Weekly Planner</h1>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className={styles.columnWrapper}>
          {columnNames.map((column, index) => {
            const filteredTodos = todos.filter(
              (todo) => todo.column === column
            );
            return (
              <Column
                key={index}
                name={column}
                todos={filteredTodos}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            );
          })}
        </div>
      </DndContext>

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
