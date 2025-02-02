import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <div className={styles.spinnerText}>Loading...</div>
    </div>
  );
}
