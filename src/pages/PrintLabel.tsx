import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { useData } from "@/context/DataContext";
import QRCode from "@/components/QRCode";
import { ROOM_CONFIG, CATEGORY_CONFIG } from "@/types";

export default function PrintLabel() {
  const { id } = useParams<{ id: string }>();
  const { boxes } = useData();
  const box = boxes.find((b) => b.id === id);

  if (!box) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 text-center">
        <Package className="mx-auto h-12 w-12 text-zinc-700" />
        <p className="mt-3 text-zinc-500">Box not found</p>
        <Link to="/" className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const qrUrl = `${window.location.origin}${import.meta.env.BASE_URL}box/${box.id}`;
  const fragileCount = box.items.filter((i) => i.fragile).length;

  return (
    <div>
      <div className="no-print mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to={`/box/${box.id}`}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Print Label
          </button>
        </div>
      </div>

      {/* Printable label */}
      <div className="mx-auto max-w-md border border-zinc-800 bg-white p-6 text-black print:border-2 print:border-black print:shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-5xl font-black">#{box.boxNumber}</div>
            <div className="mt-1 text-xl font-bold">{box.label}</div>
            <div className="mt-1 inline-block rounded border border-gray-400 px-2 py-0.5 text-sm font-semibold">
              {ROOM_CONFIG[box.room].label}
            </div>
          </div>
          <div className="shrink-0">
            <QRCode value={qrUrl} size={120} />
          </div>
        </div>

        {fragileCount > 0 && (
          <div className="mt-3 rounded border-2 border-red-600 bg-red-50 px-3 py-1.5 text-center text-lg font-black text-red-600">
            ⚠ FRAGILE ⚠
          </div>
        )}

        {box.items.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold uppercase text-gray-500">Contents</div>
            <div className="mt-1 text-sm leading-relaxed">
              {box.items.map((item, idx) => (
                <span key={item.id}>
                  {item.name}
                  {item.quantity > 1 && ` (x${item.quantity})`}
                  {item.fragile && " ⚠"}
                  {idx < box.items.length - 1 && (
                    <span className="text-gray-400"> · </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {box.items.length > 0 && (
          <div className="mt-3 flex gap-4 text-xs text-gray-500">
            <span>{box.items.length} items</span>
            <span>{box.items.reduce((s, i) => s + i.quantity, 0)} total qty</span>
            {fragileCount > 0 && <span className="text-red-600">{fragileCount} fragile</span>}
            <span>
              Categories: {[...new Set(box.items.map((i) => CATEGORY_CONFIG[i.category].label))].join(", ")}
            </span>
          </div>
        )}

        {box.notes && (
          <div className="mt-3 border-t border-gray-200 pt-2 text-xs text-gray-500">
            {box.notes}
          </div>
        )}
      </div>
    </div>
  );
}
