import { TodoList } from "../../types/todo";

export const initialTodos: TodoList = [
  {
    id: "12",
    title: "Briefe",
    column: "Donnerstag",
    status: "Done",
  },
  {
    id: "23",
    title: "Saugen",
    column: "Donnerstag",
    status: "Open",
  },
  {
    id: "34",
    title: "Splid",
    column: "Freitag",
    status: "Done",
  },
  {
    id: "214",
    title: "Splid",
    column: "Samstag",
    status: "Open",
  },
];

export const columnNames = [
  "Backlog",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];
