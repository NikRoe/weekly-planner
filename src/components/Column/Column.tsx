import { useState } from "react";
import { TodoList, TodoFromForm, Todo } from "../../../types/todo";
import styles from "./Column.module.css";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import { useDroppable } from "@dnd-kit/core";
import SortableItem from "../SortableItem/SortableItem";
import { SortableContext } from "@dnd-kit/sortable";
import { sortByStatus } from "@/utils/sort";

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
                      onDeleteTodo(todo.id);
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

function TrashIcon() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V6H17H19C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V8H5C4.44772 8 4 7.55228 4 7C4 6.44772 4.44772 6 5 6H7H9V5ZM10 8H8V18C8 18.5523 8.44772 19 9 19H15C15.5523 19 16 18.5523 16 18V8H14H10ZM13 6H11V5H13V6ZM10 9C10.5523 9 11 9.44772 11 10V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V10C9 9.44772 9.44772 9 10 9ZM14 9C14.5523 9 15 9.44772 15 10V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V10C13 9.44772 13.4477 9 14 9Z"
          fill="grey"
        ></path>{" "}
      </g>
    </svg>
  );
}
