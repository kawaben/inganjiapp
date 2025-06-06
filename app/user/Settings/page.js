
import ThemeToggle from "../../components/ThemeButton";

export default function Settings() {
 
 

  return (
    <div className="flex flex-col gap-6 p-10 h-full overflow-hidden max-w-full box-border text-[var(--text)]">
      <h1 className="text-3xl font-bold text-[var(--primary)]">Settings</h1>

      <div className="flex items-center justify-between bg-[var(--background)] p-6 rounded">
        <span className="text-lg">Theme</span>
            <ThemeToggle/>
      </div>

      <div className="flex items-center justify-between bg-[var(--background)] p-6 rounded">
        <span className="text-lg">Language</span>
      </div>

      {/* Placeholder for other settings */}
      <div className="flex items-center justify-between bg-[var(--background)] p-6 rounded">
        <span className="text-lg">Other Setting</span>
        <button className="px-4 py-2 bg-[var(--primary)] text-[var(--foreground)] cursor-pointer rounded">
          Edit
        </button>
      </div>
    </div>
  );
}
