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

      <label htmlFor="date">Datum</label>
      <input
        id="date"
        type="date"
        {...register("date")}
        defaultValue={defaultValue?.date ?? ""}
        className={styles.input}
      />

      <label htmlFor="category">Kategorie</label>
      <select
        id="category"
        {...register("category")}
        defaultValue={defaultValue?.category}
        className={styles.select}
      >
        <option value="">— Keine Kategorie —</option>
        <option value="work">Arbeit</option>
        <option value="personal">Persönlich</option>
        <option value="errand">Besorgung</option>
        <option value="focus">Fokus</option>
      </select>

      <label htmlFor="time">Uhrzeit</label>
      <input
        id="time"
        type="time"
        {...register("time")}
        defaultValue={defaultValue?.time}
        className={styles.input}
      />

      <label htmlFor="notes">weitere Notizen</label>
      <textarea
        rows={5}
        {...register("notes")}
        id="notes"
        defaultValue={defaultValue?.notes ?? ""}
        className={styles.textarea}
      ></textarea>

      <Button type="submit" title="Submit" ariaLabel="Submit" variant="default">
        Submit
      </Button>
    </form>
  );
}
