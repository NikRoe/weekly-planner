import { TodoList } from "../../types/todo";

export const initialTodos: TodoList = [
  {
    id: "12",
    title: "Briefe",
    date: "2026-04-24",
    status: "Done",
  },
  {
    id: "23",
    title: "Saugen",
    date: "2026-04-24",
    status: "Open",
  },
];

export const DAY_NAMES = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
] as const;

export type DayName = (typeof DAY_NAMES)[number];
