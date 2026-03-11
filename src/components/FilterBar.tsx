import { Search, X } from "lucide-react";
import { ROOM_LABELS, ROOM_CONFIG, type RoomLabel } from "@/types";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roomFilter: RoomLabel | "all";
  onRoomFilterChange: (value: RoomLabel | "all") => void;
  sealedFilter: "all" | "sealed" | "open";
  onSealedFilterChange: (value: "all" | "sealed" | "open") => void;
  sortBy: "number" | "room" | "items" | "updated";
  onSortChange: (value: "number" | "room" | "items" | "updated") => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  roomFilter,
  onRoomFilterChange,
  sealedFilter,
  onSealedFilterChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search boxes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-8 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <select
        value={roomFilter}
        onChange={(e) => onRoomFilterChange(e.target.value as RoomLabel | "all")}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none"
      >
        <option value="all">All Rooms</option>
        {ROOM_LABELS.map((room) => (
          <option key={room} value={room}>
            {ROOM_CONFIG[room].label}
          </option>
        ))}
      </select>

      <select
        value={sealedFilter}
        onChange={(e) => onSealedFilterChange(e.target.value as "all" | "sealed" | "open")}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none"
      >
        <option value="all">All Status</option>
        <option value="open">Open</option>
        <option value="sealed">Sealed</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as "number" | "room" | "items" | "updated")}
        className={cn(
          "rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300",
          "focus:border-blue-500 focus:outline-none",
        )}
      >
        <option value="number">Sort: Box #</option>
        <option value="room">Sort: Room</option>
        <option value="items">Sort: Item Count</option>
        <option value="updated">Sort: Last Updated</option>
      </select>
    </div>
  );
}
