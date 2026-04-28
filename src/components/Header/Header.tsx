import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useModal } from "@/provider/ModalProvider";
import Form from "@/components/Form/Form";
import { handleAddTodo } from "@/services/todos";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GearIcon,
  SunIcon,
  MoonIcon,
  SearchIcon,
  PlusIcon,
} from "@/components/Icons";
import SettingsPanel from "@/components/SettingsPanel/SettingsPanel";
import styles from "./Header.module.css";

interface HeaderProps {
  weekNumber: number;
  weekYear: number;
  weekLabel: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  weekNumber,
  weekYear,
  weekLabel,
  onPreviousWeek,
  onNextWeek,
  onTodayClick,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { openModal, closeModal } = useModal();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const gearButtonRef = useRef<HTMLButtonElement | null>(null);

  function handleNewTask() {
    openModal(
      <Form
        onSubmitTodo={(newTodo) => {
          handleAddTodo(newTodo);
          closeModal();
        }}
      />
    );
  }

  const isoWeek = `${weekYear}-W${String(weekNumber).padStart(2, "0")}`;

  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">W</span>
        <span className={styles.brandTitle}>Weekly Planner</span>
        <span className={styles.brandSub}>KW {weekNumber}</span>
      </div>

      <nav className={styles.topbarCenter} aria-label="Wochennavigation">
        <div className={styles.weekNav}>
          <button
            type="button"
            className={styles.weekNavButton}
            onClick={onPreviousWeek}
            aria-label="Vorherige Woche"
          >
            <ChevronLeftIcon />
          </button>
          <time className={styles.weekLabel} dateTime={isoWeek}>
            {weekLabel}
          </time>
          <button
            type="button"
            className={styles.weekNavButton}
            onClick={onNextWeek}
            aria-label="Nächste Woche"
          >
            <ChevronRightIcon />
          </button>
        </div>
        <button
          type="button"
          className={styles.todayChip}
          onClick={onTodayClick}
        >
          Heute
        </button>
      </nav>

      <div className={styles.topbarRight}>
        <div role="search" className={styles.search}>
          <label htmlFor="task-search" className={styles.searchIcon}>
            <SearchIcon />
            <span className={styles.visuallyHidden}>Aufgaben suchen</span>
          </label>
          <input
            id="task-search"
            type="search"
            className={styles.searchInput}
            placeholder="Suchen…"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div
          className={styles.themeToggle}
          role="group"
          aria-label="Farbschema"
        >
          <button
            type="button"
            className={`${styles.themeButton} ${theme === "light" ? styles.themeButtonActive : ""}`}
            onClick={() => setTheme("light")}
            aria-label="Helles Design"
            aria-pressed={theme === "light"}
          >
            <SunIcon />
          </button>
          <button
            type="button"
            className={`${styles.themeButton} ${theme === "dark" ? styles.themeButtonActive : ""}`}
            onClick={() => setTheme("dark")}
            aria-label="Dunkles Design"
            aria-pressed={theme === "dark"}
          >
            <MoonIcon />
          </button>
        </div>

        <button
          ref={gearButtonRef}
          type="button"
          className={`${styles.iconButton} ${isSettingsOpen ? styles.iconButtonActive : ""}`}
          onClick={() => setIsSettingsOpen((open) => !open)}
          aria-label="Einstellungen"
          aria-expanded={isSettingsOpen}
        >
          <GearIcon />
        </button>

        <button
          type="button"
          className={styles.newTaskButton}
          onClick={handleNewTask}
        >
          <PlusIcon />
          Neue Aufgabe
        </button>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        triggerRef={gearButtonRef}
      />
    </header>
  );
}
