// types/index.ts

// types/index.ts
export interface Room {
  _id: string;
  roomNumber: string;
  roomType: string;
  price: number;
  status: "available" | "reserved" | "occupied" | "maintenance";
  updatedAt: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  roomCount?: number;
}

// Extended interface for room details (if your detail endpoint returns more data)
export interface RoomDetail extends Room {
  description?: string;
  amenities?: string[];
  images?: string[];
  capacity?: number;
  // Add any additional fields from your room detail endpoint
}

// User interface (if needed)
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
}

// Session interface (if you extend NextAuth session)
export interface CustomSession {
  user: User;
  accessToken?: string;
  expires: string;
}
