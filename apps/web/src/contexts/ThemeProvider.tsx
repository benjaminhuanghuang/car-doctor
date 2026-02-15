import { useEffect, useState } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { ThemeContext, type Theme } from './ThemeContext';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'react-theme-boilerplate-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getItem<Theme>(storageKey) ?? defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      setItem(storageKey, systemTheme);
      return;
    }

    root.classList.add(theme);
    setItem(storageKey, theme);
  }, [theme, storageKey]);

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
