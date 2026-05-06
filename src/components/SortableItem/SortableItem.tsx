import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "../../../types/todo";
import { useModal } from "@/provider/ModalProvider";
import { CheckIcon, ClockIcon, PenIcon, TrashIcon } from "@/components/Icons";
import { handleDeleteTodo, handleEditTodo } from "@/services/todos";
import Button from "../Button/Button";
import Wrapper from "../Wrapper/Wrapper";
import Form from "../Form/Form";
import styles from "./SortableItem.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  work: "Arbeit",
  personal: "Persönlich",
  errand: "Besorgung",
  focus: "Fokus",
};

const CATEGORY_TAG_CLASSES: Record<string, string | undefined> = {
  work: styles.tagWork,
  personal: styles.tagPersonal,
  errand: styles.tagErrand,
  focus: styles.tagFocus,
};

interface SortableItemProps {
  todo?: Todo;
  isOverlay?: boolean;
}

const defaultTodo: Todo = {
  id: "default",
  title: "Aufgabe",
  status: "Open",
};

export default function SortableItem({
  todo = defaultTodo,
  isOverlay = false,
}: SortableItemProps) {
  const { openModal, closeModal } = useModal();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  const isDone = todo.status === "Done";

  function handleToggleStatus(event: React.MouseEvent) {
    event.stopPropagation();
    handleEditTodo({ ...todo, status: isDone ? "Open" : "Done" });
  }

  function handleEditClick(event: React.MouseEvent) {
    event.stopPropagation();
    openModal(
      <Form
        onSubmitTodo={(updatedTodo) => {
          handleEditTodo({ ...todo, ...updatedTodo });
          closeModal();
        }}
        defaultValue={todo}
      />,
    );
  }

  function handleDeleteClick(event: React.MouseEvent) {
    event.stopPropagation();
    openModal(
      <Wrapper>
        <Button
          type="button"
          onClick={() => {
            handleDeleteTodo(todo.id);
            closeModal();
          }}
          ariaLabel="Todo löschen"
          title="Todo löschen"
          variant="danger"
        >
          Todo wirklich löschen?
        </Button>
        <Button
          type="button"
          onClick={closeModal}
          ariaLabel="Abbrechen"
          title="Abbrechen"
          variant="default"
        >
          Abbrechen
        </Button>
      </Wrapper>,
      true,
    );
  }

  function handlePointerDown(event: React.PointerEvent) {
    const target = event.target as HTMLElement;
    if (target.closest("[data-dnd-disabled]")) {
      event.stopPropagation();
      return;
    }
    listeners?.onPointerDown?.(event);
  }

  const cardClass = [
    styles.card,
    isDone ? styles.cardDone : "",
    isOverlay ? styles.cardOverlay : "",
  ]
    .filter(Boolean)
    .join(" ");

  const titleClass = [styles.taskTitle, isDone ? styles.taskTitleDone : ""]
    .filter(Boolean)
    .join(" ");

  const checkboxClass = [styles.checkbox, isDone ? styles.checkboxDone : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={cardClass} ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} onPointerDown={handlePointerDown}>
        <div className={styles.taskRow}>
          <button
            type="button"
            className={checkboxClass}
            onClick={handleToggleStatus}
            aria-label={
              isDone ? "Als offen markieren" : "Als erledigt markieren"
            }
            aria-pressed={isDone}
            data-dnd-disabled
          >
            {isDone && <CheckIcon />}
          </button>

          <div className={styles.taskBody}>
            <p className={titleClass}>{todo.title}</p>
            {todo.notes && <p className={styles.taskNotes}>{todo.notes}</p>}
            <div className={styles.taskFooter}>
              {todo.category && (
                <span
                  className={`${styles.tag} ${CATEGORY_TAG_CLASSES[todo.category] ?? ""}`}
                >
                  {CATEGORY_LABELS[todo.category] ?? todo.category}
                </span>
              )}
              {todo.time && (
                <span className={styles.taskTime}>
                  <ClockIcon />
                  {todo.time}
                </span>
              )}
              <div className={styles.taskMenuButtonWrapper}>
                <button
                  type="button"
                  className={styles.taskMenuButton}
                  onClick={handleEditClick}
                  aria-label="Bearbeiten"
                  data-dnd-disabled
                >
                  <PenIcon />
                </button>

                <button
                  type="button"
                  className={styles.taskMenuButton}
                  onClick={handleDeleteClick}
                  aria-label="Löschen"
                  data-dnd-disabled
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
