import { useState } from "react";
import { TodoList, TodoFromForm, Todo } from "../../../types/todo";
import styles from "./Column.module.css";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
      <ul className={styles.list} ref={setNodeRef}>
        <h2 className={styles.title}>{name}</h2>
        <SortableContext items={todos.map((todo) => todo.id)}>
          {todos.map((todo) => (
            <SortableItem
              key={todo.id}
              todo={todo}
              onClick={() => {
                handleToggleModal();
                setTodoToEdit(todo);
              }}
            >
              <>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleUpdateStatus(todo);
                  }}
                  type="button"
                  className={`${styles.button}   ${
                    todo.status === "Done" ? styles.done : ""
                  }`}
                  aria-label={`Mark as ${
                    todo.status === "Done" ? "open" : "done"
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
              </>
            </SortableItem>
          ))}
        </SortableContext>
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

function SortableItem({
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
