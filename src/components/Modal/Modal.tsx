import { ReactNode, useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  hideCloseButton: boolean;
}

export default function Modal({
  children,
  onClose,
  hideCloseButton,
}: ModalProps) {
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
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className={styles.button}
          >
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
