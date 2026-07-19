import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import AddTaskMenu from "@/components/AddTaskMenu/AddTaskMenu";

vi.mock("@/data/taskTemplates", () => ({
  TASK_TEMPLATES: [
    { id: "a", title: "Wochenplanung" },
    { id: "b", title: "Einkaufen gehen" },
  ],
}));

function renderMenu(isOpen = true) {
  const triggerRef = createRef<HTMLButtonElement>();
  const onClose = vi.fn();
  const onSelectNew = vi.fn();
  const onSelectTemplate = vi.fn();
  render(
    <>
      <button ref={triggerRef}>trigger</button>
      <AddTaskMenu
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        onSelectNew={onSelectNew}
        onSelectTemplate={onSelectTemplate}
      />
    </>
  );
  return { onClose, onSelectNew, onSelectTemplate };
}

describe("AddTaskMenu", () => {
  it("renders nothing when closed", () => {
    renderMenu(false);
    expect(screen.queryByText("Neu")).not.toBeInTheDocument();
  });

  it("shows the Neu / Vorlage verwenden choice when open", () => {
    renderMenu();
    expect(screen.getByRole("menuitem", { name: "Neu" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Vorlage verwenden" })
    ).toBeInTheDocument();
  });

  it("calls onSelectNew and closes when Neu is chosen", async () => {
    const { onClose, onSelectNew } = renderMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Neu" }));
    expect(onSelectNew).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("shows the template names after choosing Vorlage verwenden", async () => {
    renderMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Vorlage verwenden" })
    );
    expect(
      screen.getByRole("menuitem", { name: "Wochenplanung" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Einkaufen gehen" })
    ).toBeInTheDocument();
  });

  it("calls onSelectTemplate with the chosen template and closes", async () => {
    const { onClose, onSelectTemplate } = renderMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Vorlage verwenden" })
    );
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Wochenplanung" })
    );
    expect(onSelectTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "a", title: "Wochenplanung" })
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when clicking outside the panel", async () => {
    const { onClose } = renderMenu();
    await userEvent.click(document.body);
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const { onClose } = renderMenu();
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
