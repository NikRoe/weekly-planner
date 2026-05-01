import { describe, it, expect } from "vitest";
import { todoSchema } from "../lib/todoSchema";

describe("todoSchema", () => {
  describe("title", () => {
    it("accepts a title with 3 or more characters", () => {
      const result = todoSchema.safeParse({ title: "abc" });
      expect(result.success).toBe(true);
    });

    it("rejects a title shorter than 3 characters", () => {
      const result = todoSchema.safeParse({ title: "ab" });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        "Der Titel muss mindestens 3 Zeichen lang sein"
      );
    });

    it("rejects an empty title", () => {
      const result = todoSchema.safeParse({ title: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("date", () => {
    it("is optional — omitting it is valid (task goes to backlog)", () => {
      const result = todoSchema.safeParse({ title: "Test" });
      expect(result.success).toBe(true);
      expect(result.data?.date).toBeUndefined();
    });

    it("accepts a valid ISO date string", () => {
      const result = todoSchema.safeParse({ title: "Test", date: "2026-05-01" });
      expect(result.success).toBe(true);
      expect(result.data?.date).toBe("2026-05-01");
    });
  });

  describe("notes", () => {
    it("is optional", () => {
      const result = todoSchema.safeParse({ title: "Test" });
      expect(result.success).toBe(true);
    });

    it("accepts a non-empty notes string", () => {
      const result = todoSchema.safeParse({
        title: "Test",
        notes: "Some note",
      });
      expect(result.success).toBe(true);
      expect(result.data?.notes).toBe("Some note");
    });
  });
});
