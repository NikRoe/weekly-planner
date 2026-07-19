import { useEffect, useRef, useState } from "react";
import { Template } from "../../../types/template";
import { TASK_TEMPLATES } from "@/data/taskTemplates";
import { PlusIcon, ChevronLeftIcon } from "@/components/Icons";
import styles from "./AddTaskMenu.module.css";

interface AddTaskMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onSelectNew: () => void;
  onSelectTemplate: (template: Template) => void;
  align?: "left" | "right";
}

export default function AddTaskMenu({
  isOpen,
  onClose,
  triggerRef,
  onSelectNew,
  onSelectTemplate,
  align = "right",
}: AddTaskMenuProps) {
  const [step, setStep] = useState<"choice" | "templates">("choice");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) setStep("choice");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsidePanel = panelRef.current?.contains(target);
      const isInsideTrigger = triggerRef.current?.contains(target);
      if (!isInsidePanel && !isInsideTrigger) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  function handleSelectNew() {
    onClose();
    onSelectNew();
  }

  function handleSelectTemplate(template: Template) {
    onClose();
    onSelectTemplate(template);
  }

  return (
    <div
      ref={panelRef}
      className={`${styles.panel} ${align === "left" ? styles.panelLeft : styles.panelRight}`}
      role="dialog"
      aria-label="Aufgabe hinzufügen"
      aria-modal="false"
    >
      {step === "choice" ? (
        <div className={styles.choiceList} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.choiceButton}
            onClick={handleSelectNew}
          >
            <PlusIcon />
            <span>Neu</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.choiceButton}
            onClick={() => setStep("templates")}
          >
            <span>Vorlage verwenden</span>
          </button>
        </div>
      ) : (
        <div className={styles.templateStep}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => setStep("choice")}
            aria-label="Zurück"
          >
            <ChevronLeftIcon />
            <span>Zurück</span>
          </button>
          {TASK_TEMPLATES.length === 0 ? (
            <p className={styles.emptyState}>Keine Vorlagen vorhanden</p>
          ) : (
            <ul className={styles.templateList} role="menu">
              {TASK_TEMPLATES.map((template) => (
                <li key={template.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.templateButton}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    {template.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
