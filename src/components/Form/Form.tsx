import styles from "./Form.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const todoSchema = z.object({
  title: z.string().min(3, "Der Titel muss mindestens 3 Zeichen lang sein"),
  column: z.enum([
    "Backlog",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ]),
  notes: z.string().optional(),
});

type TodoFromForm = z.infer<typeof todoSchema>;

interface FormProps {
  onAddTodo: (newTodo: TodoFromForm) => void;
}

export default function Form({ onAddTodo }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TodoFromForm>({
    resolver: zodResolver(todoSchema),
  });
  function onSubmit(data: TodoFromForm) {
    onAddTodo(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label htmlFor="title">Titel*</label>
      <input id="title" type="text" required {...register("title")} />
      {errors.title && <p className={styles.error}>{errors.title.message}</p>}
      <label>
        Wochentag*
        <select required {...register("column")}>
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
      {errors.column && (
        <p className={styles.error}>Bitte einen Wochentag auswählen</p>
      )}
      <label htmlFor="notes">weitere Notizen</label>
      <textarea rows={5} {...register("notes")} id="notes"></textarea>
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
