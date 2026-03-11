import { useState } from "react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { CATEGORY_CONFIG, type BoxItem } from "@/types";
import ItemForm from "@/components/ItemForm";
import { cn } from "@/lib/utils";

interface ItemRowProps {
  item: BoxItem;
  onUpdate: (updates: Partial<BoxItem>) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export default function ItemRow({ item, onUpdate, onDelete, disabled }: ItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const categoryConfig = CATEGORY_CONFIG[item.category];

  if (isEditing) {
    return (
      <ItemForm
        initialValues={item}
        submitLabel="Update"
        onSubmit={(values) => {
          onUpdate(values);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{item.name}</span>
          {item.quantity > 1 && (
            <span className="text-xs text-zinc-500">x{item.quantity}</span>
          )}
          <span className={cn("text-xs rounded-full px-1.5 py-0.5", categoryConfig.bgColor, categoryConfig.color)}>
            {categoryConfig.label}
          </span>
          {item.fragile && (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          )}
        </div>
        {item.notes && (
          <p className="mt-0.5 text-xs text-zinc-500">{item.notes}</p>
        )}
      </div>

      {!disabled && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1 text-zinc-500 hover:bg-red-900/30 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
