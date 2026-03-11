import { useState } from "react";
import { ITEM_CATEGORIES, CATEGORY_CONFIG, type ItemCategory } from "@/types";

interface ItemFormProps {
  initialValues?: {
    name: string;
    quantity: number;
    category: ItemCategory;
    fragile: boolean;
    notes: string;
  };
  onSubmit: (values: {
    name: string;
    quantity: number;
    category: ItemCategory;
    fragile: boolean;
    notes: string;
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ItemForm({ initialValues, onSubmit, onCancel, submitLabel = "Add Item" }: ItemFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [quantity, setQuantity] = useState(initialValues?.quantity ?? 1);
  const [category, setCategory] = useState<ItemCategory>(initialValues?.category ?? "misc");
  const [fragile, setFragile] = useState(initialValues?.fragile ?? false);
  const [notes, setNotes] = useState(initialValues?.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      quantity: Math.max(1, quantity),
      category,
      fragile,
      notes: notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-xs font-medium text-zinc-400">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Coffee maker"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none"
          >
            {ITEM_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_CONFIG[c].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={fragile}
            onChange={(e) => setFragile(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm text-amber-400">Fragile</span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
