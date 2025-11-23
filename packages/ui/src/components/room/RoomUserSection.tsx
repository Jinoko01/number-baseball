'use client';

import { RoomParticipants, useSocketStore } from 'utils';
import { UserCard } from './UserCard';
import { Button } from '../common/Button';
import { useEffect } from 'react';
import { setSocket } from '@/lib/utils/socket';
import { revalidateRoomDetailAction } from '@/lib/actions/revalidateRoomDetailAction';
import { useState } from 'react';
import { leaveRoomAction } from '@/lib/actions/leaveRoom';
import { useRef } from 'react';
import { revalidateHomeAction } from '@/lib/actions/revalidateGameRoomAction';
import { SettingNumberModal } from './SettingNumberModal';

interface RoomUserSectionProps {
  roomId: number;
  _participants: RoomParticipants[];
  accessToken: string;
  user: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

export function RoomUserSection({
  roomId,
  _participants,
  accessToken,
  user,
}: RoomUserSectionProps) {
  const { socketClient, setSocketClient } = useSocketStore();
  const [participants, setParticipants] = useState(_participants);
  const [isGaming, setIsGaming] = useState(false);
  const [isSettingNumber, setIsSettingNumber] = useState(false);

  const handleGameStart = () => {
    socketClient?.emit('gameStart', { roomId });
  };

  useEffect(() => {
    const socket = setSocket({ path: '/chat', accessToken });
    setSocketClient(socket);

    const handleRoomJoined = (participants: RoomParticipants[]) => {
      setParticipants(participants);
      revalidateRoomDetailAction(roomId);
    };

    const handleRoomLeave = (participants: RoomParticipants[]) => {
      setParticipants(participants);
      revalidateRoomDetailAction(roomId);
    };

    const handleGameStart = () => {
      setIsGaming(true);
      setIsSettingNumber(true);
    };

    const handleDisconnect = async () => {
      await leaveRoomAction(roomId);
      await revalidateHomeAction();
    };

    socket.on('roomJoined', handleRoomJoined);
    socket.on('roomLeave', handleRoomLeave);
    socket.on('gameStart', handleGameStart);
    socket.once('disconnect', handleDisconnect);

    socket.emit('roomJoined', { roomId, user });

    return () => {
      socket.off('roomJoined', handleRoomJoined);
      socket.off('roomLeave', handleRoomLeave);
      socket.off('gameStart', handleGameStart);

      socket.disconnect();
    };
  }, []);

  if (!participants) {
    return null;
  }

  return (
    <div className='flex justify-evenly items-center w-full'>
      {isSettingNumber && (
        <SettingNumberModal
          roomId={roomId}
          accessToken={accessToken}
          onClose={() => setIsSettingNumber(false)}
          onSubmitted={() => setIsSettingNumber(false)}
        />
      )}
      <UserCard
        user={
          participants[0] && {
            id: participants[0].user.id,
            name: participants[0].user.name,
            nickname: participants[0].user.nickname,
            avatar: participants[0].user.avatar,
            provider: participants[0].user.provider,
          }
        }
      />
      <div className='flex flex-col gap-3'>
        <Button disabled={participants.length !== 2 || isGaming} onClick={handleGameStart}>
          게임 시작
        </Button>
      </div>
      <UserCard
        user={
          participants[1] && {
            id: participants[1].user.id,
            name: participants[1].user.name,
            nickname: participants[1].user.nickname,
            avatar: participants[1].user.avatar,
            provider: participants[1].user.provider,
          }
        }
      />
    </div>
  );
}
