import { useModal } from "@/provider/ModalProvider";
import { TodoList } from "../../../types/todo";
import Button from "../Button/Button";
import Form from "../Form/Form";
import { handleAddTodo, handleResetTodoStatus } from "@/services/todos";
import { AddIcon, RevertIcon } from "../Svg";
import styles from "./ButtonRow.module.css";

export default function ButtonRow({ todos }: { todos: TodoList }) {
  const { openModal, closeModal } = useModal();
  return (
    <div className={styles.wrapper}>
      <Button
        type="button"
        ariaLabel="open form to add todo"
        onClick={() =>
          openModal(
            <Form
              onSubmitTodo={(newTodo) => {
                handleAddTodo(newTodo);
                closeModal();
              }}
            />
          )
        }
        title="open form to add todo"
      >
        <AddIcon />
      </Button>

      <Button
        type="button"
        ariaLabel="Set all todos to open"
        title="Set all todos to open"
        onClick={() =>
          openModal(
            todos.some((todo) => todo.status === "Done") ? (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    handleResetTodoStatus();
                    closeModal();
                  }}
                  ariaLabel="Set all todos to open"
                  title="Set all todos to open"
                >
                  Alles auf Open setzen
                </Button>
                <Button
                  type="button"
                  onClick={closeModal}
                  ariaLabel="Abbrechen"
                  title="Abbrechen"
                >
                  Abbrechen
                </Button>
              </>
            ) : (
              <p className={styles.noEntryMessage}>
                Keine Einträge vorhanden, deren Status auf Open gesetzt werden
                kann.
              </p>
            )
          )
        }
      >
        <RevertIcon />
      </Button>
    </div>
  );
}
