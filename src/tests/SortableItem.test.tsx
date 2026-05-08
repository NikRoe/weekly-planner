import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalProvider } from "@/provider/ModalProvider";
import SortableItem from "@/components/SortableItem/SortableItem";

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
  }),
}));

const mockHandleToggleStatus = vi.fn();
const mockHandleEditTodo = vi.fn();

vi.mock("@/services/todos", () => ({
  handleToggleStatus: (...args: unknown[]) => mockHandleToggleStatus(...args),
  handleEditTodo: (...args: unknown[]) => mockHandleEditTodo(...args),
  handleDeleteTodo: vi.fn(),
}));

const openTodo = { id: "1", title: "Briefe schreiben", status: "Open" };
const doneTodo = { id: "2", title: "Einkaufen", status: "Done" };

function renderItem(todo = openTodo) {
  return render(
    <ModalProvider>
      <SortableItem todo={todo} />
    </ModalProvider>
  );
}

describe("SortableItem", () => {
  beforeEach(() => {
    mockHandleToggleStatus.mockClear();
    mockHandleEditTodo.mockClear();
  });

  it("renders the todo title", () => {
    renderItem();
    expect(screen.getByText("Briefe schreiben")).toBeInTheDocument();
  });

  it("shows 'Als erledigt markieren' button when status is Open", () => {
    renderItem(openTodo);
    expect(
      screen.getByRole("button", { name: "Als erledigt markieren" })
    ).toBeInTheDocument();
  });

  it("shows 'Als offen markieren' button when status is Done", () => {
    renderItem(doneTodo);
    expect(
      screen.getByRole("button", { name: "Als offen markieren" })
    ).toBeInTheDocument();
  });

  it("calls handleToggleStatus with the todo when Open todo is toggled", async () => {
    renderItem(openTodo);
    await userEvent.click(
      screen.getByRole("button", { name: "Als erledigt markieren" })
    );
    expect(mockHandleToggleStatus).toHaveBeenCalledWith(openTodo);
  });

  it("calls handleToggleStatus with the todo when Done todo is toggled", async () => {
    renderItem(doneTodo);
    await userEvent.click(
      screen.getByRole("button", { name: "Als offen markieren" })
    );
    expect(mockHandleToggleStatus).toHaveBeenCalledWith(doneTodo);
  });
});
