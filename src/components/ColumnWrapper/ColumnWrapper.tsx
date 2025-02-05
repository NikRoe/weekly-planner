import { useEffect, useRef } from "react";
import styles from "./ColumnWrapper.module.css";

export default function ColumnWrapper({ children }: { children: JSX.Element }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      wrapperRef.current?.scrollTo({
        left: (new Date().getDay() || 7) * 307,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(id);
  }, []);
  return (
    <div className={styles.columnWrapper} ref={wrapperRef}>
      {children}
    </div>
  );
}
