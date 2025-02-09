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

  function handleUpdateStatus(todoToUpdate: Todo) {
    onEditTodo({
      ...todoToUpdate,
      status: todoToUpdate.status === "Done" ? "Open" : "Done",
    });
  }

  return (
    <>
      <ul
        className={`${styles.list} ${isToday ? styles.isToday : ""} ${
          todos.length > 4 ? styles.overflowY : ""
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
                        ...(todo as Todo),
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

                      handleDeleteTodo(todo.id);
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
    </>
  );
}
