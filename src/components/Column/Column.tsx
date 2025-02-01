import { useState } from "react";
import { TodoList, TodoFromForm, Todo } from "../../../types/todo";
import styles from "./Column.module.css";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";

interface ColumnProps {
  name: string;
  todos: TodoList;
  onEditTodo: (updatedTodo: Todo) => void;
}

export default function Column({ name, todos, onEditTodo }: ColumnProps) {
  const [todoToEdit, setTodoToEdit] = useState<Todo>();
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleModal() {
    setIsOpen(!isOpen);
  }

  function handleEditTodo(updatedTodo: TodoFromForm) {
    onEditTodo({ ...(todoToEdit as Todo), ...updatedTodo });
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
            <span
              className={`${styles.status} ${
                todo.status === "Done" ? styles.done : ""
              }`}
            ></span>
            {todo.title}
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
