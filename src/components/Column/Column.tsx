import { TodoList } from "../../../types/todo";
import styles from "./Column.module.css";

import { useDroppable } from "@dnd-kit/core";
import SortableItem from "../SortableItem/SortableItem";
import { SortableContext } from "@dnd-kit/sortable";
import { sortByStatus } from "@/utils/sort";

import { useEffect, useRef } from "react";

interface ColumnProps {
  name: string;
  todos: TodoList;
  isToday: boolean;
}

export default function Column({ name, todos, isToday }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: name,
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const needsScrollbar = useRef(false);

  useEffect(() => {
    const headingHeight = 45;
    const elementHeight = 80;
    const gap = 16;

    const wrapperHeight = wrapperRef?.current?.offsetHeight;
    if (!wrapperHeight) return;
    if (
      wrapperHeight -
        (headingHeight + gap + todos.length * (elementHeight + gap)) <
      100
    ) {
      needsScrollbar.current = true;
    }
  }, [todos.length]);

  return (
    <div ref={wrapperRef}>
      <ul
        className={`${styles.list} ${isToday ? styles.isToday : ""} ${
          needsScrollbar ? styles.overflowY : ""
        }`}
        ref={setNodeRef}
      >
        <h2 className={styles.title}>{name}</h2>
        <SortableContext items={todos.map((todo) => todo.id)}>
          {todos.toSorted(sortByStatus).map((todo) => (
            <SortableItem key={todo.id} todo={todo} />
          ))}
        </SortableContext>
      </ul>
    </div>
  );
}
