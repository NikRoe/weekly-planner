import { useRef, useEffect, useState } from "react";
import DayColumn from "@/components/DayColumn/DayColumn";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { ColumnName, columnNames } from "@/utils/todos";
import { useAppSettings } from "@/provider/AppSettingsProvider";
import { getWeekData } from "@/utils/week";
import useSWR from "swr";
import { TodoList } from "../../types/todo";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import SortableItem from "@/components/SortableItem/SortableItem";
import BoardLayout from "@/components/ColumnWrapper/ColumnWrapper";
import Backlog from "@/components/Backlog/Backlog";
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

  const { hideWeekends } = useAppSettings();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const weekScrollRef = useRef<HTMLDivElement | null>(null);

  const { weekDates, weekLabel, weekNumber, weekYear, todayIndex } =
    getWeekData(weekOffset);

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
      columnNames.includes(collision.id as ColumnName),
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

  const visibleTodos = todos.filter((todo) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(query);
      const matchesNotes = todo.notes?.toLowerCase().includes(query) ?? false;
      if (!matchesTitle && !matchesNotes) return false;
    }
    if (activeFilter === "open" && todo.status === "Done") return false;
    if (activeFilter === "done" && todo.status !== "Done") return false;
    return true;
  });

  const backlogTodos = visibleTodos.filter((todo) => todo.column === "Backlog");
  const todayColumnName = todayIndex >= 0 ? DAY_COLUMN_NAMES[todayIndex] : null;
  const visibleColumnNames = hideWeekends
    ? DAY_COLUMN_NAMES.filter((name) => name !== "Samstag" && name !== "Sonntag")
    : DAY_COLUMN_NAMES;

  return (
    <>
      <Header
        weekNumber={weekNumber}
        weekYear={weekYear}
        weekLabel={weekLabel}
        onPreviousWeek={() => setWeekOffset((offset) => offset - 1)}
        onNextWeek={() => setWeekOffset((offset) => offset + 1)}
        onTodayClick={() => setWeekOffset(0)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
            sidebar={<Backlog todos={backlogTodos} />}
            main={
              <div
                className={`${styles.weekScroll} ${hideWeekends ? styles.weekScrollFiveColumns : ""}`}
                ref={weekScrollRef}
              >
                {visibleColumnNames.map((column, index) => {
                  const filteredTodos = visibleTodos.filter(
                    (todo) => todo.column === column,
                  );
                  const isToday = index === todayIndex;

                  return (
                    <DayColumn
                      key={column}
                      name={column}
                      dateNumber={weekDates[index]}
                      todos={filteredTodos}
                      isToday={isToday}
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
