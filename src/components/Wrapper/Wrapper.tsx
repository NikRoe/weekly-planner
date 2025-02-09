import { ReactNode } from "react";
import styles from "./Wrapper.module.css";

export default function Wrapper({ children }: { children: ReactNode }) {
  return <div className={`${styles.wrapper} ${styles.border}`}>{children}</div>;
}
