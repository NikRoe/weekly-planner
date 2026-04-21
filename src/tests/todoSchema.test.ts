import { describe, it, expect } from "vitest";
import { todoSchema } from "../lib/todoSchema";

describe("todoSchema", () => {
  describe("title", () => {
    it("accepts a title with 3 or more characters", () => {
      const result = todoSchema.safeParse({ title: "abc", column: "Montag" });
      expect(result.success).toBe(true);
    });

    it("rejects a title shorter than 3 characters", () => {
      const result = todoSchema.safeParse({ title: "ab", column: "Montag" });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        "Der Titel muss mindestens 3 Zeichen lang sein"
      );
    });

    it("rejects an empty title", () => {
      const result = todoSchema.safeParse({ title: "", column: "Montag" });
      expect(result.success).toBe(false);
    });
  });

  describe("column", () => {
    const validColumns = [
      "Backlog",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
      "Sonntag",
    ] as const;

    it.each(validColumns)('accepts "%s" as a valid column', (column) => {
      const result = todoSchema.safeParse({ title: "Test", column });
      expect(result.success).toBe(true);
    });

    it("rejects an unknown column", () => {
      const result = todoSchema.safeParse({ title: "Test", column: "Montag2" });
      expect(result.success).toBe(false);
    });
  });

  describe("notes", () => {
    it("is optional", () => {
      const result = todoSchema.safeParse({ title: "Test", column: "Backlog" });
      expect(result.success).toBe(true);
    });

    it("accepts a non-empty notes string", () => {
      const result = todoSchema.safeParse({
        title: "Test",
        column: "Backlog",
        notes: "Some note",
      });
      expect(result.success).toBe(true);
      expect(result.data?.notes).toBe("Some note");
    });
  });
});
