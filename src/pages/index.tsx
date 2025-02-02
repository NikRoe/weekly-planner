import { useState } from "react";
import Form from "@/components/Form/Form";
import Column from "@/components/Column/Column";
import styles from "@/styles/Home.module.css";
import Modal from "@/components/Modal/Modal";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { columnNames } from "@/utils/todos";
import useSWR from "swr";
import { TodoList } from "../../types/todo";
import {
  handleAddTodo,
  handleDeleteTodo,
  handleEditTodo,
  handleDragEnd,
} from "@/services/todos";

export default function Home() {
  const { data: todos, isLoading, error } = useSWR<TodoList>("/api/todos");
  const [isOpen, setIsOpen] = useState(false);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(pointerSensor);

  function handleToggleModal() {
    setIsOpen(!isOpen);
  }

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>An Error Occurred</div>;
  if (!todos) return;

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
            onSubmitTodo={(newTodo) => {
              handleAddTodo(newTodo);
              handleToggleModal();
            }}
          />
        </Modal>
      )}
    </>
  );
}
