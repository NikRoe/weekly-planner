import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "../../../types/todo";
import styles from "../Column/Column.module.css";
import { useState } from "react";
import { useModal } from "@/provider/ModalProvider";
import { DoneIcon, DotsIcon, EditIcon, TrashIcon } from "../Svg";
import {
  handleDeleteTodo,
  handleEditTodo as onEditTodo,
} from "@/services/todos";
import { clipString } from "@/utils/clip";
import Button from "../Button/Button";
import Wrapper from "../Wrapper/Wrapper";
import Form from "../Form/Form";

interface SortableItemProps {
  todo?: Todo;
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
  isOverlay = false,
}: SortableItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { openModal, closeModal } = useModal();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  function handleUpdateStatus(todoToUpdate: Todo) {
    onEditTodo({
      ...todoToUpdate,
      status: todoToUpdate.status === "Done" ? "Open" : "Done",
    });
  }

  function handlePointerDown(event: React.PointerEvent) {
    const target = event.target as HTMLElement;

    if (target.closest("[data-dnd-disabled]")) {
      event.stopPropagation();
      return;
    }

    listeners?.onPointerDown?.(event);
  }

  return (
    <li
      className={`${styles.card} ${isOverlay ? styles.boxShadow : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div {...listeners} onPointerDown={handlePointerDown}>
        <>
          <div className={styles.buttonWrapper}>
            <Button
              onClick={(event) => {
                event?.stopPropagation();
                handleUpdateStatus(todo);
              }}
              type="button"
              variant="svg"
              ariaLabel={`Als ${
                todo.status === "Done" ? "offen" : "erledigt"
              } markieren`}
              title={`Als ${
                todo.status === "Done" ? "offen" : "erledigt"
              } markieren`}
            >
              <DoneIcon status={todo.status} />
            </Button>

            <span style={{ display: "flex", gap: "0.25rem" }}>
              {isOpen && (
                <>
                  <Button
                    type="button"
                    variant="svg"
                    title="Bearbeiten"
                    ariaLabel="Bearbeiten"
                    onClick={(event) => {
                      event?.stopPropagation();
                      openModal(
                        <Form
                          onSubmitTodo={(updatedTodo) => {
                            onEditTodo({
                              ...todo,
                              ...updatedTodo,
                            });
                            closeModal();
                            setIsOpen(false);
                          }}
                          defaultValue={todo}
                        />
                      );
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    type="button"
                    onClick={(event) => {
                      event?.stopPropagation();
                      openModal(
                        <Wrapper>
                          <Button
                            type="button"
                            onClick={() => {
                              handleDeleteTodo(todo.id);
                              closeModal();
                              setIsOpen(false);
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
                        true
                      );
                    }}
                    ariaLabel="Eintrag löschen"
                    variant="svg"
                    title="Eintrag löschen"
                  >
                    <TrashIcon />
                  </Button>
                </>
              )}
              <Button
                data-dnd-disabled="true"
                type="button"
                onClick={(event) => {
                  event?.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                ariaLabel={`Optionen ${isOpen ? "schließen" : "öffnen"}`}
                title={`Optionen ${isOpen ? "schließen" : "öffnen"}`}
                variant="svg"
              >
                <DotsIcon data-dnd-disabled="true" />
              </Button>
            </span>
          </div>

          {todo.title.length > 25 ? clipString(todo.title) : todo.title}
        </>
      </div>
    </li>
  );
}
