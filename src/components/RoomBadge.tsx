import { ROOM_CONFIG, type RoomLabel } from "@/types";
import { cn } from "@/lib/utils";

interface RoomBadgeProps {
  room: RoomLabel;
  className?: string;
}

export default function RoomBadge({ room, className }: RoomBadgeProps) {
  const config = ROOM_CONFIG[room];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
