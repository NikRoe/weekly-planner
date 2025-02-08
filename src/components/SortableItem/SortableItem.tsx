import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "../../../types/todo";
import styles from "../Column/Column.module.css";
import { ReactNode } from "react";

interface SortableItemProps {
  todo?: Todo;
  children?: ReactNode;
  onClick?: () => void;
  isOverlay?: boolean;
}

const defaultTodo = {
  id: "12",
  title: "Briefe",
  column: "Donnerstag",
  status: "Done",
};

export default function SortableItem({
  todo = defaultTodo,
  children,
  onClick,
  isOverlay = false,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      onClick={onClick}
      className={`${styles.card} ${isOverlay ? styles.boxShadow : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </li>
  );
}
