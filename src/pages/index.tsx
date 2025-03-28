import { useState } from "react";
import Column from "@/components/Column/Column";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { columnNames } from "@/utils/todos";
import useSWR from "swr";
import { TodoList } from "../../types/todo";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import SortableItem from "@/components/SortableItem/SortableItem";
import ColumnWrapper from "@/components/ColumnWrapper/ColumnWrapper";
import Header from "@/components/Header/Header";
import ButtonRow from "@/components/ButtonRow/ButtonRow";

export default function Home() {
  const {
    data: todos,
    isLoading,
    error,
    mutate,
  } = useSWR<TodoList>("/api/todos");

  const [activeId, setActiveId] = useState<string | null>(null);

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
        <ButtonRow todos={todos} />
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={optimisticHandleDragEnd}
          onDragStart={handleDragStart}
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
                  />
                )}
              </DragOverlay>
            </>
          </ColumnWrapper>
        </DndContext>
      </main>
    </>
  );
}
