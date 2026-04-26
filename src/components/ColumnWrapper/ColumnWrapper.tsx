import { ReactNode } from "react";
import styles from "./ColumnWrapper.module.css";

interface BoardLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
}

export default function BoardLayout({ sidebar, main }: BoardLayoutProps) {
  return (
    <div className={styles.board}>
      {sidebar}
      {main}
    </div>
  );
}
