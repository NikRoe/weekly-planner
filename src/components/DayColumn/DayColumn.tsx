import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { TodoList } from "../../../types/todo";
import { sortByStatus, sortByTime } from "@/utils/sort";
import { handleAddTodo } from "@/services/todos";
import SortableItem from "@/components/SortableItem/SortableItem";
import { PlusIcon } from "@/components/Icons";
import styles from "./DayColumn.module.css";

interface DayColumnProps {
  dayName: string;
  isoDate: string;
  dateNumber: number;
  todos: TodoList;
  isToday: boolean;
}

export default function DayColumn({
  dayName,
  isoDate,
  dateNumber,
  todos,
  isToday,
}: DayColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addValue, setAddValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setNodeRef, isOver } = useDroppable({ id: isoDate });

  const doneCount = todos.filter((todo) => todo.status === "Done").length;

  function openInlineAdd() {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleInlineAddSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = addValue.trim();
    if (title) handleAddTodo({ title, date: isoDate });
    setAddValue("");
    setIsAdding(false);
  }

  const columnClass = [
    styles.column,
    isToday ? styles.isToday : "",
    isOver ? styles.isDragOver : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={columnClass}>
      <header className={styles.dayHeader}>
        <div className={styles.dayHeaderLeft}>
          <span className={styles.dayLabel}>{dayName}</span>
          <span
            className={`${styles.dayDate} ${isToday ? styles.dayDateToday : ""}`}
          >
            {dateNumber}
          </span>
        </div>
        <div className={styles.dayHeaderRight}>
          <span className={styles.dayCount}>
            {doneCount}/{todos.length}
          </span>
          <button
            type="button"
            className={styles.dayAddButton}
            onClick={openInlineAdd}
            aria-label={`Aufgabe zu ${dayName} hinzufügen`}
          >
            <PlusIcon />
          </button>
        </div>
      </header>

      <ul className={styles.dayList} ref={setNodeRef}>
        <SortableContext items={todos.map((todo) => todo.id)}>
          {todos
            .toSorted(sortByTime)
            .toSorted(sortByStatus)
            .map((todo) => (
              <SortableItem key={todo.id} todo={todo} />
            ))}
        </SortableContext>

        {isAdding ? (
          <li>
            <form
              className={styles.inlineAddForm}
              onSubmit={handleInlineAddSubmit}
            >
              <PlusIcon />
              <label
                htmlFor={`inline-add-${isoDate}`}
                className={styles.visuallyHidden}
              >
                Aufgabe hinzufügen
              </label>
              <input
                ref={inputRef}
                id={`inline-add-${isoDate}`}
                type="text"
                className={styles.inlineAddInput}
                value={addValue}
                onChange={(event) => setAddValue(event.target.value)}
                onBlur={() => {
                  setAddValue("");
                  setIsAdding(false);
                }}
                placeholder="Aufgabe…"
              />
            </form>
          </li>
        ) : (
          todos.length === 0 && (
            <li>
              <button
                type="button"
                className={styles.emptyStateButton}
                onClick={openInlineAdd}
              >
                <PlusIcon />
                <span>Nichts geplant</span>
              </button>
            </li>
          )
        )}
      </ul>
    </article>
  );
}
