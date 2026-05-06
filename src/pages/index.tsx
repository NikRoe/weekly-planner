import { useRef, useEffect, useState } from "react";
import DayColumn from "@/components/DayColumn/DayColumn";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { DAY_NAMES } from "@/utils/todos";
import { getWeekData } from "@/utils/week";
import { useAppSettings } from "@/provider/AppSettingsProvider";
import useSWR from "swr";
import { TodoList } from "../../types/todo";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import SortableItem from "@/components/SortableItem/SortableItem";
import BoardLayout from "@/components/ColumnWrapper/ColumnWrapper";
import Backlog from "@/components/Backlog/Backlog";
import Header from "@/components/Header/Header";
import Ribbon, { ActiveFilter } from "@/components/Ribbon/Ribbon";
import styles from "@/styles/Home.module.css";

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

  const {
    weekDates,
    weekISODates,
    weekLabel,
    weekNumber,
    weekYear,
    todayIndex,
  } = getWeekData(weekOffset);

  useEffect(() => {
    if (todayIndex < 0) return;

    const id = setTimeout(() => {
      weekScrollRef.current?.scrollTo({
        left: todayIndex * 150,
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

    const validDropTargetIds = new Set(["Backlog", ...weekISODates]);
    const filteredCollisions = collisions?.filter((collision) =>
      validDropTargetIds.has(collision.id as string),
    );

    if (!filteredCollisions?.length) return;

    const activeId = active.id;
    const targetId = filteredCollisions[0].id as string;
    const isBacklog = targetId === "Backlog";

    const optimisticTodos = todos.map((todo) =>
      todo.id === activeId
        ? { ...todo, date: isBacklog ? null : targetId }
        : todo,
    );

    mutate(
      async () => {
        await fetch(`/api/todos/${activeId}`, {
          method: "PATCH",
          body: JSON.stringify({ date: isBacklog ? null : targetId }),
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

  const backlogTodos = visibleTodos.filter((todo) => !todo.date);
  const todayISODate = todayIndex >= 0 ? weekISODates[todayIndex] : null;

  const visibleDays = DAY_NAMES.map((dayName, weekIndex) => ({
    dayName,
    isoDate: weekISODates[weekIndex],
    dateNumber: weekDates[weekIndex],
    weekIndex,
  })).filter((_, index) => !hideWeekends || index < 5);

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
          todayISODate={todayISODate}
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
                className={`${styles.weekScroll} ${visibleDays.length === 5 ? styles.weekScrollFiveColumns : ""}`}
                ref={weekScrollRef}
              >
                {visibleDays.map(
                  ({ dayName, isoDate, dateNumber, weekIndex }) => {
                    const filteredTodos = visibleTodos.filter(
                      (todo) => todo.date === isoDate,
                    );
                    const isToday = weekIndex === todayIndex;

                    return (
                      <DayColumn
                        key={isoDate}
                        dayName={dayName}
                        isoDate={isoDate}
                        dateNumber={dateNumber}
                        todos={filteredTodos}
                        isToday={isToday}
                      />
                    );
                  },
                )}
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
