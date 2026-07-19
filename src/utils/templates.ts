import { Template } from "../../types/template";
import { TodoFromForm } from "../lib/todoSchema";

export function templateToTodoInput(
  template: Template,
  date?: string,
): TodoFromForm {
  return {
    title: template.title,
    notes: template.notes,
    category: template.category,
    time: template.time,
    date,
  };
}
