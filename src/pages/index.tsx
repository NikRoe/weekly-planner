import { useState } from "react";
import Form from "@/components/Form/Form";
import Column from "@/components/Column/Column";
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
import { handleAddTodo, handleResetTodoStatus } from "@/services/todos";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import SortableItem from "@/components/SortableItem/SortableItem";
import ColumnWrapper from "@/components/ColumnWrapper/ColumnWrapper";
import Header from "@/components/Header/Header";
import { AddIcon, Revert } from "@/components/Svg";
import Button from "@/components/Button/Button";
import { useModal } from "@/provider/ModalProvider";

export default function Home() {
  const {
    data: todos,
    isLoading,
    error,
    mutate,
  } = useSWR<TodoList>("/api/todos");

  const [activeId, setActiveId] = useState<string | null>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  const { openModal, closeModal } = useModal();

  const sensors = useSensors(pointerSensor);

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
      <Header />
      <main>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            paddingBottom: "1rem",
          }}
        >
          <Button
            type="button"
            ariaLabel="open form to add todo"
            onClick={() =>
              openModal(
                <Form
                  onSubmitTodo={(newTodo) => {
                    handleAddTodo(newTodo);
                    closeModal();
                  }}
                />
              )
            }
            title="open form to add todo"
          >
            <AddIcon />
          </Button>

          <Button
            type="button"
            ariaLabel="Set all todos to open"
            title="Set all todos to open"
            onClick={() =>
              openModal(
                todos.some((todo) => todo.status === "Done") ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => {
                        handleResetTodoStatus();
                        closeModal();
                      }}
                      ariaLabel="Set all todos to open"
                      title="Set all todos to open"
                    >
                      Alles auf Open setzen
                    </Button>
                    <Button
                      type="button"
                      onClick={closeModal}
                      ariaLabel="Abbrechen"
                      title="Abbrechen"
                    >
                      Abbrechen
                    </Button>
                  </>
                ) : (
                  <p style={{ maxWidth: "80%" }}>
                    Keine Einträge vorhanden, deren Status auf Open gesetzt
                    werden kann.
                  </p>
                )
              )
            }
          >
            <Revert />
          </Button>
        </div>
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
      </main>
    </>
  );
}
