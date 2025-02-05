import { useState } from "react";
import { TodoList, TodoFromForm, Todo } from "../../../types/todo";
import styles from "./Column.module.css";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import { useDroppable } from "@dnd-kit/core";
import SortableItem from "../SortableItem/SortableItem";
import { SortableContext } from "@dnd-kit/sortable";

interface ColumnProps {
  name: string;
  todos: TodoList;
  isToday: boolean;
  onEditTodo: (updatedTodo: Todo) => void;
  onDeleteTodo: (idToDelete: string) => void;
}

export default function Column({
  name,
  todos,
  isToday,
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
      <ul
        className={`${styles.list} ${isToday ? styles.isToday : ""}`}
        ref={setNodeRef}
      >
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
                      onDeleteTodo(todo.id);
                    }}
                    aria-label="Eintrag löschen"
                    className={styles.deleteButton}
                    title="Eintrag löschen"
                  >
                    X
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

function DoneIcon({ status }: { status: string }) {
  return (
    <svg
      fill={status === "Done" ? "#3ac200" : "white"}
      width="16px"
      height="16px"
      viewBox="0 -1.5 27 27"
      xmlns="http://www.w3.org/2000/svg"
      stroke={status === "Done" ? "#3ac200" : "white"}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="m24 24h-24v-24h18.4v2.4h-16v19.2h20v-8.8h2.4v11.2zm-19.52-12.42 1.807-1.807 5.422 5.422 13.68-13.68 1.811 1.803-15.491 15.491z"></path>
      </g>
    </svg>
  );
}
