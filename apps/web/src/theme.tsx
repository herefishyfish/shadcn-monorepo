import { createContext, useContext, useState, type ReactNode } from 'react';

type Appearance = 'light' | 'dark';

const ThemeContext = createContext<{
  appearance: Appearance;
  setAppearance: (value: Appearance) => void;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>('light');
  const setAppearance = (value: Appearance) => {
    setAppearanceState(value);
    document.documentElement.classList.toggle('dark', value === 'dark');
  };
  return (
    <ThemeContext.Provider
      value={{
        appearance,
        setAppearance,
        toggle: () => setAppearance(appearance === 'dark' ? 'light' : 'dark'),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useWebTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useWebTheme must be used inside ThemeProvider');
  return theme;
}
