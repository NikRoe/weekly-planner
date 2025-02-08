import { ReactNode } from "react";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  onClick: () => void;
  title: string;
  children: ReactNode;
  ariaLabel: string;
  disabled?: boolean;
}

export default function Button({
  type = "button",
  onClick,
  title,
  ariaLabel,
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
      aria-label={ariaLabel}
      className=""
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      {children}
    </button>
  );
}
