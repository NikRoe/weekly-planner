import { TodoList } from "../../../types/todo";
import styles from "./Ribbon.module.css";

export type ActiveFilter = "all" | "open" | "done";

const FILTER_OPTIONS: { value: ActiveFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "open", label: "Offen" },
  { value: "done", label: "Erledigt" },
];

interface RibbonProps {
  todos: TodoList;
  todayColumnName: string | null;
  activeFilter: ActiveFilter;
  onFilterChange: (filter: ActiveFilter) => void;
}

export default function Ribbon({
  todos,
  todayColumnName,
  activeFilter,
  onFilterChange,
}: RibbonProps) {
  const todayTodos = todayColumnName
    ? todos.filter((todo) => todo.column === todayColumnName)
    : [];
  const todayDoneCount = todayTodos.filter((todo) => todo.status === "Done").length;

  const openCount = todos.filter(
    (todo) => todo.column !== "Backlog" && todo.status !== "Done"
  ).length;
  const doneCount = todos.filter(
    (todo) => todo.column !== "Backlog" && todo.status === "Done"
  ).length;
  const backlogCount = todos.filter((todo) => todo.column === "Backlog").length;

  const totalScheduled = openCount + doneCount;
  const progressPercentage =
    totalScheduled > 0 ? Math.round((doneCount / totalScheduled) * 100) : 0;

  return (
    <section className={styles.ribbon} aria-label="Wochenstatistik">
      <dl className={styles.statItem}>
        <dt className={styles.statLabel}>Heute</dt>
        <dd className={styles.statNumber}>
          {todayDoneCount}
          <span className={styles.statNumberMuted}>/{todayTodos.length}</span>
        </dd>
      </dl>

      <dl className={styles.statItem}>
        <dt className={styles.statLabel}>Offen</dt>
        <dd className={styles.statNumber}>{openCount}</dd>
      </dl>

      <dl className={styles.statItem}>
        <dt className={styles.statLabel}>Erledigt</dt>
        <dd className={styles.statNumber}>{doneCount}</dd>
      </dl>

      <dl className={styles.statItem}>
        <dt className={styles.statLabel}>Backlog</dt>
        <dd className={styles.statNumber}>{backlogCount}</dd>
      </dl>

      <div className={styles.rightSection}>
        <div
          role="group"
          aria-label="Aufgaben filtern"
          className={styles.filterGroup}
        >
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${styles.filterChip} ${activeFilter === value ? styles.filterChipActive : ""}`}
              onClick={() => onFilterChange(value)}
              aria-pressed={activeFilter === value}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          role="progressbar"
          aria-label="Wochenfortschritt"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className={styles.progressBar}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <span className={styles.progressPercentage} aria-hidden="true">
          {progressPercentage}%
        </span>
      </div>
    </section>
  );
}
