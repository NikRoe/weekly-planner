import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "@/components/Form/Form";

async function fillAndSubmit(title: string, date = "") {
  await userEvent.clear(screen.getByLabelText("Titel"));
  await userEvent.type(screen.getByLabelText("Titel"), title);
  if (date) {
    await userEvent.type(screen.getByLabelText("Datum"), date);
  }
  await userEvent.click(screen.getByRole("button", { name: "Anlegen" }));
}

describe("Form", () => {
  it("renders title, date and notes fields", () => {
    render(<Form onSubmitTodo={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByLabelText("Titel")).toBeInTheDocument();
    expect(screen.getByLabelText("Datum")).toBeInTheDocument();
    expect(screen.getByLabelText("Notizen")).toBeInTheDocument();
  });

  it("calls onSubmitTodo with correct data on valid submit", async () => {
    const onSubmit = vi.fn();
    render(<Form onSubmitTodo={onSubmit} onClose={vi.fn()} />);
    await fillAndSubmit("Einkaufen", "2026-05-01");
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Einkaufen", date: "2026-05-01" })
    );
  });

  it("does not call onSubmitTodo when title is too short", async () => {
    const onSubmit = vi.fn();
    render(<Form onSubmitTodo={onSubmit} onClose={vi.fn()} />);
    await fillAndSubmit("ab");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error message when title is too short", async () => {
    render(<Form onSubmitTodo={vi.fn()} onClose={vi.fn()} />);
    await fillAndSubmit("ab");
    expect(
      screen.getByText("Der Titel muss mindestens 3 Zeichen lang sein")
    ).toBeInTheDocument();
  });

  it("submits successfully without a date (goes to backlog)", async () => {
    const onSubmit = vi.fn();
    render(<Form onSubmitTodo={onSubmit} onClose={vi.fn()} />);
    await fillAndSubmit("Briefe");
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Briefe" })
    );
  });

  it("pre-fills fields when defaultValue is provided", () => {
    render(
      <Form
        onSubmitTodo={vi.fn()}
        onClose={vi.fn()}
        defaultValue={{ id: "1", title: "Vorhandene Aufgabe", status: "Open" }}
      />
    );
    expect(screen.getByLabelText<HTMLInputElement>("Titel").value).toBe("Vorhandene Aufgabe");
  });
});
