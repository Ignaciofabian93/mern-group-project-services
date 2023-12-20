export interface User {
  id: string;
  username: string;
  room: string;
}

export interface Rooms {
  [roomName: string]: User[];
}

export interface RoomCounts {
  [roomName: string]: number;
}
