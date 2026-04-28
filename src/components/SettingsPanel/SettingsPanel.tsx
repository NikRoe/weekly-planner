import { useEffect, useRef } from "react";
import { useAppSettings, Density } from "@/provider/AppSettingsProvider";
import styles from "./SettingsPanel.module.css";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: "compact", label: "Kompakt" },
  { value: "default", label: "Standard" },
  { value: "roomy", label: "Luftig" },
];

export default function SettingsPanel({
  isOpen,
  onClose,
  triggerRef,
}: SettingsPanelProps) {
  const { density, accentHue, showGrain, hideWeekends, updateSettings } =
    useAppSettings();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsidePanel = panelRef.current?.contains(target);
      const isInsideTrigger = triggerRef.current?.contains(target);
      if (!isInsidePanel && !isInsideTrigger) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={styles.panel}
      role="dialog"
      aria-label="Einstellungen"
      aria-modal="false"
    >
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Einstellungen</h2>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Einstellungen schließen"
        >
          ✕
        </button>
      </div>

      <div className={styles.panelBody}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Erscheinungsbild</h3>

          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Dichte</span>
            <div
              role="group"
              aria-label="Dichte auswählen"
              className={styles.segmented}
            >
              {DENSITY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.segmentButton} ${density === value ? styles.segmentButtonActive : ""}`}
                  onClick={() => updateSettings({ density: value })}
                  aria-pressed={density === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingLabelRow}>
              <label htmlFor="accent-hue" className={styles.settingLabel}>
                Akzent-Farbton
              </label>
              <span
                className={styles.accentPreview}
                style={{ background: `oklch(68% 0.14 ${accentHue})` }}
                aria-hidden="true"
              />
            </div>
            <input
              id="accent-hue"
              type="range"
              min={0}
              max={360}
              value={accentHue}
              onChange={(event) =>
                updateSettings({ accentHue: Number(event.target.value) })
              }
              className={styles.slider}
            />
          </div>

          <div className={styles.settingRowInline}>
            <span className={styles.settingLabel}>Papier-Textur</span>
            <button
              type="button"
              role="switch"
              aria-checked={showGrain}
              className={`${styles.toggle} ${showGrain ? styles.toggleActive : ""}`}
              onClick={() => updateSettings({ showGrain: !showGrain })}
              aria-label="Papier-Textur umschalten"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Ansicht</h3>

          <div className={styles.settingRowInline}>
            <span className={styles.settingLabel}>Wochenende ausblenden</span>
            <button
              type="button"
              role="switch"
              aria-checked={hideWeekends}
              className={`${styles.toggle} ${hideWeekends ? styles.toggleActive : ""}`}
              onClick={() => updateSettings({ hideWeekends: !hideWeekends })}
              aria-label="Wochenende ausblenden umschalten"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
