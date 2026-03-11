import { Save, Undo2, Loader2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";

export default function SaveButton() {
  const { hasUnsavedChanges, isSaving, save, discard } = useData();

  if (!hasUnsavedChanges) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={discard}
        disabled={isSaving}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
          "bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        <Undo2 className="h-4 w-4" />
        Discard
      </button>
      <button
        onClick={save}
        disabled={isSaving}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
          "bg-emerald-600 text-white hover:bg-emerald-500 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "animate-pulse",
        )}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
