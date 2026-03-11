import { Link } from "react-router-dom";
import { Package, AlertTriangle, Lock } from "lucide-react";
import RoomBadge from "@/components/RoomBadge";
import { cn } from "@/lib/utils";
import type { Box } from "@/types";

interface BoxCardProps {
  box: Box;
}

export default function BoxCard({ box }: BoxCardProps) {
  const itemCount = box.items.length;
  const totalQuantity = box.items.reduce((sum, i) => sum + i.quantity, 0);
  const fragileCount = box.items.filter((i) => i.fragile).length;

  return (
    <Link
      to={`/box/${box.id}`}
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-4 transition-all hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/50",
        box.sealed && "border-emerald-800/50 bg-emerald-950/20",
      )}
    >
      {box.sealed && (
        <div className="absolute right-3 top-3">
          <Lock className="h-4 w-4 text-emerald-500" />
        </div>
      )}

      <div className="mb-3 flex items-start gap-3">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          box.sealed ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400",
        )}>
          <Package className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">#{box.boxNumber}</span>
            <RoomBadge room={box.room} />
          </div>
          <h3 className="mt-0.5 truncate text-sm font-semibold text-zinc-100 group-hover:text-white">
            {box.label}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
        <span className="text-zinc-700">|</span>
        <span>{totalQuantity} total qty</span>
        {fragileCount > 0 && (
          <>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="h-3 w-3" />
              {fragileCount} fragile
            </span>
          </>
        )}
      </div>

      {box.notes && (
        <p className="mt-2 line-clamp-2 text-xs text-zinc-500">{box.notes}</p>
      )}
    </Link>
  );
}
