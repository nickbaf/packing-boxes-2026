import { useState, useMemo } from "react";
import { Package, Box as BoxIcon, AlertTriangle, Lock } from "lucide-react";
import { useData } from "@/context/DataContext";
import BoxCard from "@/components/BoxCard";
import FilterBar from "@/components/FilterBar";
import { ROOM_CONFIG, type RoomLabel } from "@/types";

export default function Dashboard() {
  const { boxes, isLoading } = useData();
  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState<RoomLabel | "all">("all");
  const [sealedFilter, setSealedFilter] = useState<"all" | "sealed" | "open">("all");
  const [sortBy, setSortBy] = useState<"number" | "room" | "items" | "updated">("number");

  const stats = useMemo(() => {
    const totalItems = boxes.reduce((sum, b) => sum + b.items.length, 0);
    const totalQuantity = boxes.reduce((sum, b) => sum + b.items.reduce((s, i) => s + i.quantity, 0), 0);
    const fragileItems = boxes.reduce((sum, b) => sum + b.items.filter((i) => i.fragile).length, 0);
    const sealedCount = boxes.filter((b) => b.sealed).length;
    return { totalItems, totalQuantity, fragileItems, sealedCount };
  }, [boxes]);

  const filtered = useMemo(() => {
    let result = [...boxes];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.label.toLowerCase().includes(q) ||
          b.notes.toLowerCase().includes(q) ||
          b.items.some((i) => i.name.toLowerCase().includes(q)) ||
          `#${b.boxNumber}`.includes(q),
      );
    }

    if (roomFilter !== "all") {
      result = result.filter((b) => b.room === roomFilter);
    }

    if (sealedFilter === "sealed") {
      result = result.filter((b) => b.sealed);
    } else if (sealedFilter === "open") {
      result = result.filter((b) => !b.sealed);
    }

    switch (sortBy) {
      case "number":
        result.sort((a, b) => a.boxNumber - b.boxNumber);
        break;
      case "room":
        result.sort((a, b) => ROOM_CONFIG[a.room].label.localeCompare(ROOM_CONFIG[b.room].label));
        break;
      case "items":
        result.sort((a, b) => b.items.length - a.items.length);
        break;
      case "updated":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    return result;
  }, [boxes, search, roomFilter, sealedFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-8 w-8 animate-pulse text-blue-400" />
          <p className="mt-2 text-sm text-zinc-500">Loading boxes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Packing Boxes</h1>
        <p className="mt-1 text-sm text-zinc-500">Track everything for the big move</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-card p-3">
          <div className="flex items-center gap-2">
            <BoxIcon className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-zinc-500">Total Boxes</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{boxes.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-card p-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-zinc-500">Total Items</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{stats.totalItems}</p>
          <p className="text-xs text-zinc-600">{stats.totalQuantity} total qty</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-card p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-zinc-500">Fragile Items</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-400">{stats.fragileItems}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-card p-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-zinc-500">Sealed</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {stats.sealedCount}/{boxes.length}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          roomFilter={roomFilter}
          onRoomFilterChange={setRoomFilter}
          sealedFilter={sealedFilter}
          onSealedFilterChange={setSealedFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16">
          <Package className="h-12 w-12 text-zinc-700" />
          <p className="mt-3 text-sm text-zinc-500">
            {boxes.length === 0 ? "No boxes yet. Start packing!" : "No boxes match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
    </div>
  );
}
