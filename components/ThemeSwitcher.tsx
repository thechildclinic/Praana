import React from 'react';
import { useTheme } from '../ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  if (!availableThemes || availableThemes.length === 0) return null;

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <select
        value={theme.id}
        onChange={handleThemeChange}
        className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-[var(--theme-text-on-header)] bg-black/10 hover:bg-black/20 rounded-md shadow-sm focus:outline-none focus:ring-2 ring-[var(--theme-highlight-focus)] ring-offset-2 ring-offset-[var(--theme-bg-header)] transition-colors cursor-pointer"
        aria-label="Select color theme"
      >
        {availableThemes.map((t) => (
          <option key={t.id} value={t.id} className="text-black bg-white">
            {t.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--theme-text-on-header)] opacity-70">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
