import { TodoFromForm } from "../../../types/todo";
import styles from "./Form.module.css";

export default function Form({
  onAddTodo,
}: {
  onAddTodo: (newTodo: TodoFromForm) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form as HTMLFormElement);
    const data = Object.fromEntries(formData) as TodoFromForm;

    onAddTodo(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="title">Titel*</label>
      <input name="title" id="title" type="text" required aria-required />
      <label>
        Wochentag*
        <select required aria-required name="column">
          <option value="Backlog">Backlog</option>
          <option value="Montag">Montag</option>
          <option value="Dienstag">Dienstag</option>
          <option value="Mittwoch">Mittwoch</option>
          <option value="Donnerstag">Donnerstag</option>
          <option value="Freitag">Freitag</option>
          <option value="Samstag">Samstag</option>
          <option value="Sonntag">Sonntag</option>
        </select>
      </label>
      <label htmlFor="notes">weitere Notizen</label>
      <textarea rows={5} name="notes" id="notes"></textarea>
      <button
        type="submit"
        className={styles.button}
        aria-label="Neues Todo hinzufügen"
      >
        Add Todo
      </button>
    </form>
  );
}
