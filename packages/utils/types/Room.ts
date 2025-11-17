export type Room = {
  id: number;
  title: string;
  capacity: number;
  currentCount: number;
  participantIds: number[];
  createdAt: string;
};
