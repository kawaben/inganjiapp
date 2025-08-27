
'use client';
import { useUser, SUPPORTED_LANGUAGES } from '../context/UserContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useUser();

  return (
    <div className="flex items-center gap-2 p-2 bg-[var(--background2)] rounded-lg">
      
      
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="px-2 py-1 text-sm bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-md text-[var(--btext)]"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}