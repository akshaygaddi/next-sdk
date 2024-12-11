// utils/room-utils.ts
import { z } from "zod";
import { throttle, debounce } from "lodash";

// Room validation schema
export const roomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(50),
  type: z.enum(["public", "private"]),
  room_code: z.string().length(6),
  password: z.string().nullable(),
  created_by: z.string(),
  expires_at: z.string().nullable(),
  is_active: z.boolean(),
  participant_count: z.number().int().min(0),
});

// Permission checks
export const ROOM_ACTIONS = {
  JOIN: "join",
  LEAVE: "leave",
  TERMINATE: "terminate",
  VIEW: "view",
} as const;

export type RoomAction = (typeof ROOM_ACTIONS)[keyof typeof ROOM_ACTIONS];

export const checkRoomPermission = (
  action: RoomAction,
  room: any,
  userId: string | null,
): boolean => {
  if (!userId) return false;

  switch (action) {
    case ROOM_ACTIONS.JOIN:
      return !room.participants?.includes(userId);
    case ROOM_ACTIONS.LEAVE:
      return room.participants?.includes(userId) && room.created_by !== userId;
    case ROOM_ACTIONS.TERMINATE:
      return room.created_by === userId;
    case ROOM_ACTIONS.VIEW:
      return (
        room.type === "public" ||
        room.created_by === userId ||
        room.participants?.includes(userId)
      );
    default:
      return false;
  }
};

// Input sanitization
export const sanitizeSearchQuery = (query: string): string => {
  return query.replace(/[^\w\s-]/gi, "").trim();
};

// Throttled search
export const createThrottledSearch = (callback: (value: string) => void) =>
  throttle((value: string) => {
    callback(sanitizeSearchQuery(value));
  }, 300);

// Debounced room update
export const createDebouncedRoomUpdate = (callback: () => void) =>
  debounce(callback, 500);

// Validate room data
export const validateRoom = (room: unknown) => {
  try {
    return roomSchema.parse(room);
  } catch (error) {
    console.error("Invalid room data:", error);
    return null;
  }
};

// Error handling
export class RoomError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true,
  ) {
    super(message);
    this.name = "RoomError";
  }
}

// Rate limiting
const rateLimits = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ACTIONS = 30; // 30 actions per minute

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userActions = rateLimits.get(userId) || 0;

  if (userActions >= MAX_ACTIONS) {
    return false;
  }

  rateLimits.set(userId, userActions + 1);
  setTimeout(() => {
    rateLimits.set(userId, (rateLimits.get(userId) || 1) - 1);
  }, RATE_LIMIT_WINDOW);

  return true;
};
