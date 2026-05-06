import { AlertTriangleIcon } from "@/components/Icons";
import styles from "./DeleteConfirmModal.module.css";

interface DeleteConfirmModalProps {
  taskTitle: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  taskTitle,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <AlertTriangleIcon />
      </div>

      <h2 className={styles.heading}>Aufgabe löschen?</h2>

      <blockquote className={styles.taskQuote}>{taskTitle}</blockquote>

      <p className={styles.hint}>
        Diese Aktion kann nicht rückgängig gemacht werden.
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.buttonCancel}
          onClick={onClose}
        >
          Abbrechen
        </button>
        <button
          type="button"
          className={styles.buttonDelete}
          onClick={onConfirm}
        >
          Löschen
        </button>
      </div>
    </div>
  );
}