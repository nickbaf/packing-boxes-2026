import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  Printer,
  Package,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import RoomBadge from "@/components/RoomBadge";
import BoxForm from "@/components/BoxForm";
import ItemForm from "@/components/ItemForm";
import ItemRow from "@/components/ItemRow";
import QRCode from "@/components/QRCode";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function BoxDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boxes, updateBox, deleteBox, addItem, updateItem, deleteItem } = useData();
  const [isEditingBox, setIsEditingBox] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const box = boxes.find((b) => b.id === id);

  if (!box) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-zinc-700" />
          <p className="mt-3 text-zinc-500">Box not found</p>
          <Link to="/" className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const qrUrl = `${window.location.origin}${import.meta.env.BASE_URL}box/${box.id}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="no-print mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Boxes
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {/* Box header */}
          <div className="rounded-xl border border-zinc-800 bg-card p-6">
            {isEditingBox ? (
              <BoxForm
                initialValues={{ label: box.label, room: box.room, notes: box.notes }}
                submitLabel="Update Box"
                onSubmit={(values) => {
                  updateBox(box.id, values);
                  setIsEditingBox(false);
                }}
                onCancel={() => setIsEditingBox(false)}
              />
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-zinc-500">#{box.boxNumber}</span>
                      <RoomBadge room={box.room} />
                      {box.sealed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                          <Lock className="h-3 w-3" />
                          Sealed
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl font-bold text-zinc-100">{box.label}</h1>
                    {box.notes && (
                      <p className="mt-1 text-sm text-zinc-500">{box.notes}</p>
                    )}
                    <p className="mt-2 text-xs text-zinc-600">
                      Updated {formatDateTime(box.updatedAt)} by {box.createdBy}
                    </p>
                  </div>

                  <div className="no-print flex items-center gap-1">
                    <button
                      onClick={() => updateBox(box.id, { sealed: !box.sealed })}
                      className={cn(
                        "rounded-lg p-2 transition-colors",
                        box.sealed
                          ? "text-emerald-400 hover:bg-emerald-900/30"
                          : "text-zinc-500 hover:bg-zinc-800",
                      )}
                      title={box.sealed ? "Unseal box" : "Seal box"}
                    >
                      {box.sealed ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setIsEditingBox(true)}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                      title="Edit box"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/print/${box.id}`}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                      title="Print label"
                    >
                      <Printer className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                      title="Delete box"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {showDeleteConfirm && (
                  <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-sm text-red-400">Delete this box and all its contents?</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          deleteBox(box.id);
                          navigate("/");
                        }}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="rounded-xl border border-zinc-800 bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">
                Contents ({box.items.length} item{box.items.length !== 1 ? "s" : ""})
              </h2>
              {!box.sealed && !isAddingItem && (
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="no-print flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              )}
            </div>

            {isAddingItem && (
              <div className="mb-4">
                <ItemForm
                  onSubmit={(values) => {
                    addItem(box.id, values);
                    setIsAddingItem(false);
                  }}
                  onCancel={() => setIsAddingItem(false)}
                />
              </div>
            )}

            {box.items.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Package className="h-8 w-8 text-zinc-700" />
                <p className="mt-2 text-sm text-zinc-500">This box is empty</p>
              </div>
            ) : (
              <div className="space-y-2">
                {box.items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => updateItem(box.id, item.id, updates)}
                    onDelete={() => deleteItem(box.id, item.id)}
                    disabled={box.sealed}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-card p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-400">QR Code</h3>
            <div className="flex justify-center rounded-lg bg-white p-3">
              <QRCode value={qrUrl} size={200} />
            </div>
            <p className="mt-2 text-center text-xs text-zinc-600">
              Scan to open this box
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-card p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-400">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Items</span>
                <span className="text-zinc-200">{box.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Qty</span>
                <span className="text-zinc-200">
                  {box.items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Fragile</span>
                <span className="text-amber-400">
                  {box.items.filter((i) => i.fragile).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status</span>
                <span className={box.sealed ? "text-emerald-400" : "text-zinc-200"}>
                  {box.sealed ? "Sealed" : "Open"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
