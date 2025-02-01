import { TodoList } from "../../../types/todo";
import styles from "./Column.module.css";

interface ColumnProps {
  name: string;
  todos: TodoList;
}

export default function Column({ name, todos }: ColumnProps) {
  return (
    <ul className={styles.list}>
      <h2 className={styles.title}>{name}</h2>
      {todos.map((todo) => (
        <li key={todo.id} className={styles.card}>
          <span
            className={`${styles.status} ${
              todo.status === "Done" ? styles.done : ""
            }`}
          ></span>
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
