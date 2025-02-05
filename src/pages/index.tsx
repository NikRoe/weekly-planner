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
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { columnNames } from "@/utils/todos";
import useSWR from "swr";
import { TodoList } from "../../types/todo";
import { handleAddTodo } from "@/services/todos";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import SortableItem from "@/components/SortableItem/SortableItem";
import ColumnWrapper from "@/components/ColumnWrapper/ColumnWrapper";

export default function Home() {
  const {
    data: todos,
    isLoading,
    error,
    mutate,
  } = useSWR<TodoList>("/api/todos");
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>An Error Occurred</div>;
  if (!todos) return;

  function optimisticHandleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { over, active, collisions } = event;

    if (!over || !todos) return;

    const filteredCollisions = collisions?.filter((collision) =>
      columnNames.includes(collision.id as string)
    );

    if (!filteredCollisions?.length) return;

    const activeId = active.id;
    const newColumn = filteredCollisions[0].id as string;
    const optimisticTodos = todos?.map((todo) =>
      todo.id === activeId ? { ...todo, column: newColumn } : todo
    );

    mutate(
      async () => {
        await fetch(`/api/todos/${activeId}`, {
          method: "PATCH",
          body: JSON.stringify({ column: newColumn }),
          headers: { "Content-Type": "application/json" },
        });

        return optimisticTodos;
      },
      {
        optimisticData: optimisticTodos,
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Weekly Planner</h1>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={optimisticHandleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <ColumnWrapper>
          <>
            {columnNames.map((column, index) => {
              const filteredTodos = todos.filter(
                (todo) => todo.column === column
              );
              const today = new Date().getDay();
              const isToday = today === index % 7 && column !== "Backlog";

              return (
                <Column
                  key={column}
                  isToday={isToday}
                  name={column}
                  todos={filteredTodos}
                />
              );
            })}
            <DragOverlay>
              {activeId && (
                <SortableItem
                  todo={todos.find((todo) => todo.id === activeId)}
                  isOverlay
                >
                  <p>{todos.find((todo) => todo.id === activeId)?.title}</p>
                </SortableItem>
              )}
            </DragOverlay>
          </>
        </ColumnWrapper>
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
