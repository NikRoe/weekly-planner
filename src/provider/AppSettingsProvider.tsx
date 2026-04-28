import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Density = "compact" | "default" | "roomy";

interface AppSettings {
  density: Density;
  accentHue: number;
  showGrain: boolean;
  hideWeekends: boolean;
}

interface AppSettingsContextType extends AppSettings {
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  density: "default",
  accentHue: 65,
  showGrain: true,
  hideWeekends: false,
};

const STORAGE_KEY = "weekly-planner-settings";

function loadFromStorage(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined
);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadFromStorage());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", settings.density);
    document.documentElement.style.setProperty(
      "--accent-h",
      String(settings.accentHue)
    );
  }, [settings.density, settings.accentHue]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  function updateSettings(patch: Partial<AppSettings>) {
    setSettings((previous) => ({ ...previous, ...patch }));
  }

  return (
    <AppSettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
      {settings.showGrain && (
        <div className="paper-grain" aria-hidden="true" />
      )}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextType {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
}
