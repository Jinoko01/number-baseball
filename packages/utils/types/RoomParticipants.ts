import { User } from './User';

export type RoomParticipants = {
  id: number;
  user: User;
  role: string;
  joinedAt: string;
};
