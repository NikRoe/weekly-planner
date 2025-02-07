import { handleResetTodoStatus } from "@/services/todos";
import { Revert } from "../Svg";
import { TodoList } from "../../../types/todo";
import { useState } from "react";
import Modal from "../Modal/Modal";
import { createPortal } from "react-dom";

interface HeaderProps {
  todos: TodoList;
}

export default function Header({ todos }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <header style={{ position: "relative" }}>
        <h1 style={{ textAlign: "center", margin: "1rem" }}>Weekly Planner</h1>
        <button
          type="button"
          onClick={handleToggleModal}
          style={{
            position: "absolute",
            top: "12px",
            left: "75vw",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          title="Set all todos to open"
        >
          <Revert />
        </button>
      </header>
      {isOpen &&
        createPortal(
          <Modal onClose={handleToggleModal}>
            <>
              {todos.some((todo) => todo.status === "Done") ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetTodoStatus();
                      handleToggleModal();
                    }}
                  >
                    Alle Einträge auf Open setzen?
                  </button>
                  <button type="button" onClick={handleToggleModal}>
                    Abbrechen
                  </button>
                </>
              ) : (
                <p style={{ maxWidth: "80%" }}>
                  Keine Einträge vorhanden, deren Status auf Open gesetzt werden
                  kann.
                </p>
              )}
            </>
          </Modal>,
          document.body
        )}
    </>
  );
}
