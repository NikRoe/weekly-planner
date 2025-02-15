import { TodoList, Todo } from "../../../types/todo";
import styles from "./Column.module.css";
import Form from "../Form/Form";
import { useDroppable } from "@dnd-kit/core";
import SortableItem from "../SortableItem/SortableItem";
import { SortableContext } from "@dnd-kit/sortable";
import { sortByStatus } from "@/utils/sort";
import { DoneIcon, TrashIcon } from "../Svg";
import {
  handleDeleteTodo,
  handleEditTodo as onEditTodo,
} from "@/services/todos";
import { clipString } from "@/utils/clip";
import { useModal } from "@/provider/ModalProvider";
import Button from "../Button/Button";
import Wrapper from "../Wrapper/Wrapper";
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
  const { openModal, closeModal } = useModal();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const needsScrollbar = useRef(false);

  function handleUpdateStatus(todoToUpdate: Todo) {
    onEditTodo({
      ...todoToUpdate,
      status: todoToUpdate.status === "Done" ? "Open" : "Done",
    });
  }

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
            <SortableItem
              key={todo.id}
              todo={todo}
              onClick={() => {
                openModal(
                  <Form
                    onSubmitTodo={(updatedTodo) => {
                      onEditTodo({
                        ...todo,
                        ...updatedTodo,
                      });
                      closeModal();
                    }}
                    defaultValue={todo}
                  />
                );
              }}
            >
              <>
                <div className={styles.buttonWrapper}>
                  <Button
                    onClick={(event) => {
                      event?.stopPropagation();
                      handleUpdateStatus(todo);
                    }}
                    type="button"
                    variant="svg"
                    ariaLabel={`Mark as ${
                      todo.status === "Done" ? "open" : "done"
                    }`}
                    title={`Mark as ${
                      todo.status === "Done" ? "open" : "done"
                    }`}
                  >
                    <DoneIcon status={todo.status} />
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
                </div>
                <p>
                  {todo.title.length > 25 ? clipString(todo.title) : todo.title}
                </p>
              </>
            </SortableItem>
          ))}
        </SortableContext>
      </ul>
    </div>
  );
}
