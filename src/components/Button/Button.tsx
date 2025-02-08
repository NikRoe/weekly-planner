import { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  onClick: () => void;
  title: string;
  children: ReactNode;
  ariaLabel: string;
  variant: string;
  disabled?: boolean;
}

export default function Button({
  type = "button",
  onClick,
  title,
  ariaLabel,
  disabled = false,
  children,
  variant,
}: ButtonProps) {
  const className =
    variant === "default"
      ? styles.button
      : variant === "danger"
      ? styles.danger
      : variant === "svg"
      ? styles.svg
      : "";
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
