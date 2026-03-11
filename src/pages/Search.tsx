import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Package, AlertTriangle } from "lucide-react";
import { useData } from "@/context/DataContext";
import RoomBadge from "@/components/RoomBadge";
import { CATEGORY_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

export default function Search() {
  const { boxes } = useData();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return boxes.flatMap((box) =>
      box.items
        .filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.notes.toLowerCase().includes(q) ||
            CATEGORY_CONFIG[item.category].label.toLowerCase().includes(q),
        )
        .map((item) => ({ box, item })),
    );
  }, [boxes, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Search Items</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Find any item across all your boxes
        </p>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="What are you looking for? e.g. coffee maker, laptop..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-4 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
      </div>

      {query.trim() && results.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Package className="h-12 w-12 text-zinc-700" />
          <p className="mt-3 text-zinc-500">No items found matching "{query}"</p>
          <p className="mt-1 text-sm text-zinc-600">Try a different search term</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="mb-3 text-sm text-zinc-500">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          {results.map(({ box, item }) => {
            const catConfig = CATEGORY_CONFIG[item.category];
            return (
              <Link
                key={`${box.id}-${item.id}`}
                to={`/box/${box.id}`}
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-card p-4 hover:border-zinc-600 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-zinc-500">x{item.quantity}</span>
                    )}
                    <span className={cn("text-xs rounded-full px-1.5 py-0.5", catConfig.bgColor, catConfig.color)}>
                      {catConfig.label}
                    </span>
                    {item.fragile && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    )}
                  </div>
                  {item.notes && (
                    <p className="mt-0.5 text-xs text-zinc-500">{item.notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">#{box.boxNumber}</span>
                    <RoomBadge room={box.room} />
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{box.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!query.trim() && (
        <div className="flex flex-col items-center py-16">
          <SearchIcon className="h-12 w-12 text-zinc-700" />
          <p className="mt-3 text-zinc-500">Start typing to search across all boxes</p>
          <p className="mt-1 text-sm text-zinc-600">
            {boxes.reduce((sum, b) => sum + b.items.length, 0)} items in {boxes.length} boxes
          </p>
        </div>
      )}
    </div>
  );
}
