export const ITEM_CATEGORIES = [
  "electronics",
  "clothing",
  "kitchenware",
  "books",
  "toiletries",
  "documents",
  "decor",
  "bedding",
  "tools",
  "misc",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const CATEGORY_CONFIG: Record<
  ItemCategory,
  { label: string; color: string; bgColor: string }
> = {
  electronics: { label: "Electronics", color: "text-blue-400", bgColor: "bg-blue-400/15" },
  clothing: { label: "Clothing", color: "text-pink-400", bgColor: "bg-pink-400/15" },
  kitchenware: { label: "Kitchenware", color: "text-orange-400", bgColor: "bg-orange-400/15" },
  books: { label: "Books", color: "text-amber-400", bgColor: "bg-amber-400/15" },
  toiletries: { label: "Toiletries", color: "text-cyan-400", bgColor: "bg-cyan-400/15" },
  documents: { label: "Documents", color: "text-yellow-400", bgColor: "bg-yellow-400/15" },
  decor: { label: "Decor", color: "text-purple-400", bgColor: "bg-purple-400/15" },
  bedding: { label: "Bedding", color: "text-indigo-400", bgColor: "bg-indigo-400/15" },
  tools: { label: "Tools", color: "text-zinc-400", bgColor: "bg-zinc-400/15" },
  misc: { label: "Misc", color: "text-stone-400", bgColor: "bg-stone-400/15" },
};

export const ROOM_LABELS = [
  "living_room",
  "bedroom",
  "kitchen",
  "bathroom",
  "office",
  "garage",
  "storage",
  "other",
] as const;

export type RoomLabel = (typeof ROOM_LABELS)[number];

export const ROOM_CONFIG: Record<
  RoomLabel,
  { label: string; color: string; bgColor: string }
> = {
  living_room: { label: "Living Room", color: "text-emerald-400", bgColor: "bg-emerald-400/15" },
  bedroom: { label: "Bedroom", color: "text-violet-400", bgColor: "bg-violet-400/15" },
  kitchen: { label: "Kitchen", color: "text-orange-400", bgColor: "bg-orange-400/15" },
  bathroom: { label: "Bathroom", color: "text-cyan-400", bgColor: "bg-cyan-400/15" },
  office: { label: "Office", color: "text-blue-400", bgColor: "bg-blue-400/15" },
  garage: { label: "Garage", color: "text-zinc-400", bgColor: "bg-zinc-400/15" },
  storage: { label: "Storage", color: "text-amber-400", bgColor: "bg-amber-400/15" },
  other: { label: "Other", color: "text-stone-400", bgColor: "bg-stone-400/15" },
};

export interface BoxItem {
  id: string;
  name: string;
  quantity: number;
  category: ItemCategory;
  fragile: boolean;
  notes: string;
}

export interface Box {
  id: string;
  label: string;
  boxNumber: number;
  room: RoomLabel;
  items: BoxItem[];
  notes: string;
  sealed: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoxesData {
  boxes: Box[];
  users: string[];
}
