import styles from "./Form.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "../../../types/todo";
import Button from "../Button/Button";
import { todoSchema, type TodoFromForm } from "../../lib/todoSchema";

interface FormProps {
  onSubmitTodo: (newTodo: TodoFromForm) => void;
  defaultValue?: Todo;
}

export default function Form({ onSubmitTodo, defaultValue }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TodoFromForm>({
    resolver: zodResolver(todoSchema),
  });
  function onSubmit(data: TodoFromForm) {
    onSubmitTodo(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label htmlFor="title">Titel*</label>
      <input
        id="title"
        type="text"
        required
        {...register("title")}
        defaultValue={defaultValue?.title}
        autoFocus
        className={styles.input}
      />
      {errors.title && <p className={styles.error}>{errors.title.message}</p>}
      <label htmlFor="weekday">Wochentag*</label>
      <select
        id="weekday"
        required
        {...register("column")}
        defaultValue={defaultValue?.column}
        className={styles.select}
      >
        <option value="Backlog">Backlog</option>
        <option value="Montag">Montag</option>
        <option value="Dienstag">Dienstag</option>
        <option value="Mittwoch">Mittwoch</option>
        <option value="Donnerstag">Donnerstag</option>
        <option value="Freitag">Freitag</option>
        <option value="Samstag">Samstag</option>
        <option value="Sonntag">Sonntag</option>
      </select>
      {errors.column && (
        <p className={styles.error}>Bitte einen Wochentag auswählen</p>
      )}
      <label htmlFor="notes">weitere Notizen</label>
      <textarea
        rows={5}
        {...register("notes")}
        id="notes"
        defaultValue={defaultValue?.notes}
        className={styles.textarea}
      ></textarea>
      <Button type="submit" title="Submit" ariaLabel="Submit" variant="default">
        Submit
      </Button>
    </form>
  );
}
