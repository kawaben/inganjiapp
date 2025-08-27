'use client';
import { useUser } from '../context/UserContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useUser();

  return (
    <div className="flex items-center gap-2 p-2 bg-[var(--background2)] rounded-lg">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
        className="px-2 py-1 text-sm bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-md text-[var(--text)]"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}