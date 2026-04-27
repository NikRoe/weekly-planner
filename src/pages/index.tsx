import { useRef, useEffect, useState } from "react";
import Column from "@/components/Column/Column";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { columnNames } from "@/utils/todos";
import { getWeekData } from "@/utils/week";
import useSWR from "swr";
import { TodoList } from "../../types/todo";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import SortableItem from "@/components/SortableItem/SortableItem";
import BoardLayout from "@/components/ColumnWrapper/ColumnWrapper";
import Header from "@/components/Header/Header";
import Ribbon, { ActiveFilter } from "@/components/Ribbon/Ribbon";
import styles from "@/styles/Home.module.css";

const DAY_COLUMN_NAMES = columnNames.filter((name) => name !== "Backlog");

export default function Home() {
  const {
    data: todos,
    isLoading,
    error,
    mutate,
  } = useSWR<TodoList>("/api/todos");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const weekScrollRef = useRef<HTMLDivElement | null>(null);

  const { weekLabel, weekNumber, weekYear, todayIndex } = getWeekData(weekOffset);

  useEffect(() => {
    if (todayIndex < 0) return;

    const id = setTimeout(() => {
      weekScrollRef.current?.scrollTo({
        left: todayIndex * 307,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(id);
  }, [todayIndex]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>An Error Occurred</div>;
  if (!todos) return;

  function optimisticHandleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { over, active, collisions } = event;

    if (!over || !todos) return;

    const filteredCollisions = collisions?.filter((collision) =>
      columnNames.includes(collision.id as string),
    );

    if (!filteredCollisions?.length) return;

    const activeId = active.id;
    const newColumn = filteredCollisions[0].id as string;
    const optimisticTodos = todos?.map((todo) =>
      todo.id === activeId ? { ...todo, column: newColumn } : todo,
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
      },
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  const backlogTodos = todos.filter((todo) => todo.column === "Backlog");
  const todayColumnName = todayIndex >= 0 ? DAY_COLUMN_NAMES[todayIndex] : null;

  return (
    <>
      <Header
        weekNumber={weekNumber}
        weekYear={weekYear}
        weekLabel={weekLabel}
        onPreviousWeek={() => setWeekOffset((offset) => offset - 1)}
        onNextWeek={() => setWeekOffset((offset) => offset + 1)}
        onTodayClick={() => setWeekOffset(0)}
      />
      <main>
        <Ribbon
          todos={todos}
          todayColumnName={todayColumnName}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={optimisticHandleDragEnd}
          onDragStart={handleDragStart}
        >
          <BoardLayout
            sidebar={
              <Column name="Backlog" todos={backlogTodos} isToday={false} />
            }
            main={
              <div className={styles.weekScroll} ref={weekScrollRef}>
                {DAY_COLUMN_NAMES.map((column, index) => {
                  const filteredTodos = todos.filter(
                    (todo) => todo.column === column,
                  );
                  const isToday = index === todayIndex;

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
              </div>
            }
          />
        </DndContext>
      </main>
    </>
  );
}
