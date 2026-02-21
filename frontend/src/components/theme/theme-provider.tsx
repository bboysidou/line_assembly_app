import { createContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  effectiveTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  effectiveTheme: "light",
  setTheme: () => null,
});

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored === "system" || !stored) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return stored;
  });

  const updateEffectiveTheme = useCallback((newTheme: Theme) => {
    let effective: "dark" | "light";
    if (newTheme === "system") {
      effective = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      effective = newTheme;
    }
    setEffectiveTheme(effective);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  useEffect(() => {
    updateEffectiveTheme(theme);
    
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme, updateEffectiveTheme]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        effectiveTheme,
        setTheme: (theme: Theme) => {
          localStorage.setItem(storageKey, theme);
          setThemeState(theme);
          updateEffectiveTheme(theme);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
};

export { ThemeProviderContext };
