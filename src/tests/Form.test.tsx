import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "@/components/Form/Form";

async function fillAndSubmit(title: string, column = "Montag") {
  await userEvent.clear(screen.getByLabelText("Titel*"));
  await userEvent.type(screen.getByLabelText("Titel*"), title);
  await userEvent.selectOptions(screen.getByLabelText("Wochentag*"), column);
  await userEvent.click(screen.getByRole("button", { name: "Submit" }));
}

describe("Form", () => {
  it("renders title, weekday and notes fields", () => {
    render(<Form onSubmitTodo={vi.fn()} />);
    expect(screen.getByLabelText("Titel*")).toBeInTheDocument();
    expect(screen.getByLabelText("Wochentag*")).toBeInTheDocument();
    expect(screen.getByLabelText("weitere Notizen")).toBeInTheDocument();
  });

  it("calls onSubmitTodo with correct data on valid submit", async () => {
    const onSubmit = vi.fn();
    render(<Form onSubmitTodo={onSubmit} />);
    await fillAndSubmit("Einkaufen", "Freitag");
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Einkaufen", column: "Freitag" })
    );
  });

  it("does not call onSubmitTodo when title is too short", async () => {
    const onSubmit = vi.fn();
    render(<Form onSubmitTodo={onSubmit} />);
    await fillAndSubmit("ab");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error message when title is too short", async () => {
    render(<Form onSubmitTodo={vi.fn()} />);
    await fillAndSubmit("ab");
    expect(
      screen.getByText("Der Titel muss mindestens 3 Zeichen lang sein")
    ).toBeInTheDocument();
  });

  it("submits successfully without notes", async () => {
    const onSubmit = vi.fn();
    render(<Form onSubmitTodo={onSubmit} />);
    await fillAndSubmit("Briefe", "Backlog");
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Briefe", column: "Backlog" })
    );
  });

  it("pre-fills fields when defaultValue is provided", () => {
    render(
      <Form
        onSubmitTodo={vi.fn()}
        defaultValue={{ id: "1", title: "Vorhandene Aufgabe", column: "Mittwoch", status: "Open" }}
      />
    );
    expect(screen.getByLabelText<HTMLInputElement>("Titel*").value).toBe("Vorhandene Aufgabe");
  });
});
