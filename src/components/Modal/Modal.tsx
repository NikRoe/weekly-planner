import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({
  children,
  onClose,
}: {
  children: JSX.Element;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.outerWrapper}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.innerWrapper}>
        <button
          type="button"
          onClick={onClose}
          aria-label="close form"
          className={styles.button}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
