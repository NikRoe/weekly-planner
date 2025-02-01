import { TodoFromForm } from "../../types/todo";

export default function Form({
  onAddTodo,
}: {
  onAddTodo: (newTodo: TodoFromForm) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    onAddTodo(data as TodoFromForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        maxWidth: "400px",
        gap: "1rem",
      }}
    >
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
        style={{ alignSelf: "center", padding: "1rem 0.75rem" }}
      >
        Add Todo
      </button>
    </form>
  );
}
