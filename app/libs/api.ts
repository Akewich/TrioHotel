// lib/api.ts
import { Room, RoomDetail } from "@/types/rooms";

export const roomService = {
  async getAllRooms(): Promise<Room[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getRoomById(id: string): Promise<RoomDetail> {
    const response = await fetch(`${process.env.API_URL}/rooms/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
