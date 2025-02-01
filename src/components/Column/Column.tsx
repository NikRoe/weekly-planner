import { useState } from "react";
import { TodoList, TodoFromForm, Todo } from "../../../types/todo";
import styles from "./Column.module.css";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";

interface ColumnProps {
  name: string;
  todos: TodoList;
  onEditTodo: (updatedTodo: Todo) => void;
  onDeleteTodo: (idToDelete: string) => void;
}

export default function Column({
  name,
  todos,
  onEditTodo,
  onDeleteTodo,
}: ColumnProps) {
  const [todoToEdit, setTodoToEdit] = useState<Todo>();
  const [isOpen, setIsOpen] = useState(false);

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
      <ul className={styles.list}>
        <h2 className={styles.title}>{name}</h2>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={styles.card}
            onClick={() => {
              handleToggleModal();
              setTodoToEdit(todo);
            }}
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleUpdateStatus(todo);
              }}
              type="button"
              className={`${styles.button}   ${
                todo.status === "Done" ? styles.done : ""
              }`}
            ></button>
            {todo.title}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteTodo(todo.id);
              }}
              aria-label="Eintrag löschen"
              className={styles.deleteButton}
            >
              X
            </button>
          </li>
        ))}
      </ul>
      {isOpen && (
        <Modal onClose={handleToggleModal}>
          <Form
            onAddTodo={(newTodo) => {
              handleEditTodo(newTodo);
              handleToggleModal();
            }}
            defaultValue={todoToEdit}
          />
        </Modal>
      )}
    </>
  );
}
