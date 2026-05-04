import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { TodoList } from "../../../types/todo";
import { sortByStatus } from "@/utils/sort";
import { handleAddTodo } from "@/services/todos";
import SortableItem from "@/components/SortableItem/SortableItem";
import styles from "./Backlog.module.css";
import { SidebarIcon } from "@/components/Icons";

interface BacklogProps {
  todos: TodoList;
}

export default function Backlog({ todos }: BacklogProps) {
  const [composerValue, setComposerValue] = useState("");
  const { setNodeRef } = useDroppable({ id: "Backlog" });
  const [isBacklogOpen, setIsBacklogOpen] = useState(true);

  function handleComposerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = composerValue.trim();
    if (!title) return;
    handleAddTodo({ title });
    setComposerValue("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsBacklogOpen(!isBacklogOpen)}
        style={{ position: "absolute", zIndex: "2" }}
        aria-label={`Backlog ${isBacklogOpen ? "aus" : "ein"}blenden`}
      >
        <SidebarIcon />
      </button>

      {isBacklogOpen && (
        <aside className={styles.backlog} aria-label="Backlog">
          <header className={styles.backlogHeader}>
            <h2 className={styles.backlogTitle}>Backlog</h2>
            <span
              className={styles.backlogCount}
              aria-label={`${todos.length} Einträge`}
            >
              {todos.length}
            </span>
          </header>

          <p className={styles.backlogHint}>
            Ideen, die auf ihren Moment warten.
          </p>

          <ul className={styles.backlogList} ref={setNodeRef}>
            <SortableContext items={todos.map((todo) => todo.id)}>
              {todos.toSorted(sortByStatus).map((todo) => (
                <SortableItem key={todo.id} todo={todo} />
              ))}
            </SortableContext>
            {todos.length === 0 && (
              <li className={styles.emptyState}>Backlog ist leer</li>
            )}
          </ul>

          <footer className={styles.composer}>
            <form
              onSubmit={handleComposerSubmit}
              className={styles.composerForm}
            >
              <label
                htmlFor="backlog-composer"
                className={styles.visuallyHidden}
              >
                Neue Aufgabe zum Backlog hinzufügen
              </label>
              <input
                id="backlog-composer"
                type="text"
                className={styles.composerInput}
                value={composerValue}
                onChange={(event) => setComposerValue(event.target.value)}
                placeholder="Neue Aufgabe zum Backlog…"
              />
              <span className={styles.composerHint} aria-hidden="true">
                ↵
              </span>
            </form>
          </footer>
        </aside>
      )}
    </>
  );
}
