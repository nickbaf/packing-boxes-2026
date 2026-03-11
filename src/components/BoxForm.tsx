import { useState } from "react";
import { ROOM_LABELS, ROOM_CONFIG, type RoomLabel } from "@/types";

interface BoxFormProps {
  initialValues?: { label: string; room: RoomLabel; notes: string };
  onSubmit: (values: { label: string; room: RoomLabel; notes: string }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function BoxForm({ initialValues, onSubmit, onCancel, submitLabel = "Create Box" }: BoxFormProps) {
  const [label, setLabel] = useState(initialValues?.label ?? "");
  const [room, setRoom] = useState<RoomLabel>(initialValues?.room ?? "living_room");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSubmit({ label: label.trim(), room, notes: notes.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Box Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder='e.g. "Kitchen Essentials"'
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Room</label>
        <select
          value={room}
          onChange={(e) => setRoom(e.target.value as RoomLabel)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none"
        >
          {ROOM_LABELS.map((r) => (
            <option key={r} value={r}>
              {ROOM_CONFIG[r].label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this box..."
          rows={3}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
