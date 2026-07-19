import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "../../../types/todo";
import { todoSchema, type TodoFromForm } from "../../lib/todoSchema";
import styles from "./Form.module.css";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "work", label: "Arbeit" },
  { value: "personal", label: "Persönlich" },
  { value: "errand", label: "Besorgung" },
  { value: "focus", label: "Fokus" },
];

interface FormProps {
  onSubmitTodo: (newTodo: TodoFromForm) => void;
  defaultValue?: Todo;
  initialValues?: TodoFromForm;
  onClose: () => void;
}

export default function Form({
  onSubmitTodo,
  defaultValue,
  initialValues,
  onClose,
}: FormProps) {
  const isEditMode = !!defaultValue;

  const { register, handleSubmit, control, formState: { errors } } = useForm<TodoFromForm>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: defaultValue?.title ?? initialValues?.title ?? "",
      date: defaultValue?.date ?? initialValues?.date ?? "",
      notes: defaultValue?.notes ?? initialValues?.notes ?? "",
      category: defaultValue?.category ?? initialValues?.category ?? "",
      time: defaultValue?.time ?? initialValues?.time ?? "",
    },
  });

  function onSubmit(data: TodoFromForm) {
    onSubmitTodo(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.modalHead}>
        <div>
          <p className={styles.eyebrow}>
            {isEditMode ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
          </p>
          <h2 className={styles.modalTitle}>
            {isEditMode ? defaultValue.title : "Was möchtest du tun?"}
          </h2>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Schließen"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.fieldLabel}>Titel</label>
          <input
            id="title"
            type="text"
            {...register("title")}
            placeholder="z. B. Wochenplanung"
            autoFocus
            className={styles.input}
          />
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="notes" className={styles.fieldLabel}>Notizen</label>
          <textarea
            id="notes"
            {...register("notes")}
            placeholder="Optional — Details, Kontext, Links"
            rows={3}
            className={styles.textarea}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="date" className={styles.fieldLabel}>Datum</label>
            <input
              id="date"
              type="date"
              {...register("date")}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="time" className={styles.fieldLabel}>Uhrzeit</label>
            <input
              id="time"
              type="time"
              {...register("time")}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Kategorie</span>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <div className={styles.chipGroup}>
                {CATEGORIES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.chip} ${field.value === value ? styles.chipActive : ""}`}
                    onClick={() => field.onChange(field.value === value ? "" : value)}
                    data-cat={value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      <div className={styles.modalFoot}>
        <button type="button" className={styles.btnSecondary} onClick={onClose}>
          Abbrechen
        </button>
        <button type="submit" className={styles.btnPrimary}>
          {isEditMode ? "Speichern" : "Anlegen"}
        </button>
      </div>
    </form>
  );
}
