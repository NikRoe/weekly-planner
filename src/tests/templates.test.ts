import { describe, it, expect } from "vitest";
import { templateToTodoInput } from "@/utils/templates";
import { Template } from "../../types/template";

const template: Template = {
  id: "weekly-planning",
  title: "Wochenplanung",
  notes: "Prioritäten für die Woche festlegen",
  category: "work",
};

describe("templateToTodoInput", () => {
  it("maps title, notes and category from the template", () => {
    const result = templateToTodoInput(template);
    expect(result.title).toBe("Wochenplanung");
    expect(result.notes).toBe("Prioritäten für die Woche festlegen");
    expect(result.category).toBe("work");
  });

  it("attaches the given date", () => {
    const result = templateToTodoInput(template, "2026-07-20");
    expect(result.date).toBe("2026-07-20");
  });

  it("omits the date when none is provided (goes to backlog)", () => {
    const result = templateToTodoInput(template);
    expect(result.date).toBeUndefined();
  });

  it("leaves optional fields undefined when the template doesn't set them", () => {
    const result = templateToTodoInput({ id: "standup", title: "Daily Standup" });
    expect(result.notes).toBeUndefined();
    expect(result.category).toBeUndefined();
    expect(result.time).toBeUndefined();
  });
});
