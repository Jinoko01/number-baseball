import { RoomParticipants } from './RoomParticipants';

export type Room = {
  id: number;
  title: string;
  capacity: number;
  currentCount: number;
  participants: RoomParticipants[];
  createdAt: string;
};
