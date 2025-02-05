import { useState } from "react";
import { TodoList, TodoFromForm, Todo } from "../../../types/todo";
import styles from "./Column.module.css";
import Modal from "../Modal/Modal";
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

interface ColumnProps {
  name: string;
  todos: TodoList;
  isToday: boolean;
}

export default function Column({ name, todos, isToday }: ColumnProps) {
  const [todoToEdit, setTodoToEdit] = useState<Todo>();
  const [isOpen, setIsOpen] = useState(false);
  const { setNodeRef } = useDroppable({
    id: name,
  });

  function handleToggleModal() {
    setIsOpen(!isOpen);
  }

  function handleEditTodo(updatedTodo: TodoFromForm) {
    onEditTodo({ ...(todoToEdit as Todo), ...updatedTodo });
  }

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
                handleToggleModal();
                setTodoToEdit(todo);
              }}
            >
              <>
                <div className={styles.buttonWrapper}>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleUpdateStatus(todo);
                    }}
                    type="button"
                    className={styles.button}
                    aria-label={`Mark as ${
                      todo.status === "Done" ? "open" : "done"
                    }`}
                    title={`Mark as ${
                      todo.status === "Done" ? "open" : "done"
                    }`}
                  >
                    <DoneIcon status={todo.status} />
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      handleDeleteTodo(todo.id);
                    }}
                    aria-label="Eintrag löschen"
                    className={styles.deleteButton}
                    title="Eintrag löschen"
                  >
                    <TrashIcon />
                  </button>
                </div>
                <p>{todo.title}</p>
              </>
            </SortableItem>
          ))}
        </SortableContext>
      </ul>

      {isOpen && (
        <Modal onClose={handleToggleModal}>
          <Form
            onSubmitTodo={(updatedTodo) => {
              handleEditTodo(updatedTodo);
              handleToggleModal();
            }}
            defaultValue={todoToEdit}
          />
        </Modal>
      )}
    </>
  );
}
