import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { v4 as uuid } from "uuid";
import { fetchBoxes, saveBoxes } from "@/api/github";
import { useAuth } from "@/context/AuthContext";
import type { Box, BoxItem, BoxesData, RoomLabel, ItemCategory } from "@/types";

interface DataContextType {
  boxes: Box[];
  users: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  refresh: () => Promise<void>;
  save: () => Promise<void>;
  discard: () => void;

  addBox: (box: { label: string; room: RoomLabel; notes: string }) => void;
  updateBox: (id: string, updates: Partial<Pick<Box, "label" | "room" | "notes" | "sealed">>) => void;
  deleteBox: (id: string) => void;

  addItem: (boxId: string, item: { name: string; quantity: number; category: ItemCategory; fragile: boolean; notes: string }) => void;
  updateItem: (boxId: string, itemId: string, updates: Partial<BoxItem>) => void;
  deleteItem: (boxId: string, itemId: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, username } = useAuth();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState<string>("[]");
  const [currentSha, setCurrentSha] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(boxes) !== savedSnapshot,
    [boxes, savedSnapshot],
  );

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, sha } = await fetchBoxes();
      setBoxes(data.boxes);
      setUsers(data.users);
      setSavedSnapshot(JSON.stringify(data.boxes));
      setCurrentSha(sha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const updatedUsers = users.includes(username)
        ? users
        : [...users, username];
      const data: BoxesData = { boxes, users: updatedUsers };
      const newSha = await saveBoxes(data, currentSha, `[${username}] Update packing boxes`);
      setSavedSnapshot(JSON.stringify(boxes));
      setUsers(updatedUsers);
      setCurrentSha(newSha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [boxes, users, username, currentSha]);

  const discard = useCallback(() => {
    setBoxes(JSON.parse(savedSnapshot));
  }, [savedSnapshot]);

  const addBox = useCallback(
    (input: { label: string; room: RoomLabel; notes: string }) => {
      const now = new Date().toISOString();
      const maxNum = boxes.reduce((max, b) => Math.max(max, b.boxNumber), 0);
      const newBox: Box = {
        id: uuid(),
        label: input.label,
        boxNumber: maxNum + 1,
        room: input.room,
        items: [],
        notes: input.notes,
        sealed: false,
        createdBy: username,
        createdAt: now,
        updatedAt: now,
      };
      setBoxes((prev) => [...prev, newBox]);
    },
    [username, boxes],
  );

  const updateBox = useCallback(
    (id: string, updates: Partial<Pick<Box, "label" | "room" | "notes" | "sealed">>) => {
      setBoxes((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b,
        ),
      );
    },
    [],
  );

  const deleteBox = useCallback((id: string) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addItem = useCallback(
    (boxId: string, item: { name: string; quantity: number; category: ItemCategory; fragile: boolean; notes: string }) => {
      const newItem: BoxItem = { id: uuid(), ...item };
      setBoxes((prev) =>
        prev.map((b) =>
          b.id === boxId
            ? { ...b, items: [...b.items, newItem], updatedAt: new Date().toISOString() }
            : b,
        ),
      );
    },
    [],
  );

  const updateItem = useCallback(
    (boxId: string, itemId: string, updates: Partial<BoxItem>) => {
      setBoxes((prev) =>
        prev.map((b) =>
          b.id === boxId
            ? {
                ...b,
                items: b.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
                updatedAt: new Date().toISOString(),
              }
            : b,
        ),
      );
    },
    [],
  );

  const deleteItem = useCallback((boxId: string, itemId: string) => {
    setBoxes((prev) =>
      prev.map((b) =>
        b.id === boxId
          ? {
              ...b,
              items: b.items.filter((i) => i.id !== itemId),
              updatedAt: new Date().toISOString(),
            }
          : b,
      ),
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        boxes,
        users,
        isLoading,
        isSaving,
        error,
        hasUnsavedChanges,
        refresh,
        save,
        discard,
        addBox,
        updateBox,
        deleteBox,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
