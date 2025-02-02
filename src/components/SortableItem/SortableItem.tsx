import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "../../../types/todo";
import styles from "../Column/Column.module.css";

export default function SortableItem({
  todo,
  children,
  onClick,
}: {
  todo: Todo;
  children: JSX.Element;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      onClick={onClick}
      className={styles.card}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </li>
  );
}
