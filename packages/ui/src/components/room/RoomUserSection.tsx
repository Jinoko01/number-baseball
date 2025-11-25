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
import type { GameStateResponse } from '@/lib/apis/game/getState';
import { GuessNumberModal } from './GuessNumberModal';

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
  const [isGuessing, setIsGuessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const participantsRef = useRef(participants);

  const sendGameStart = () => {
    socketClient?.emit('gameStart', { roomId });
  };

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

  const handleGameState = (state: GameStateResponse) => {
    const currentParticipants = participantsRef.current;
    const enemy = currentParticipants.find((p) => p.user.id !== user.id);
    const enemyId = enemy?.user.id;

    if (state.state === 'in_progress') {
      setStatusMsg(
        state.turn === user.id
          ? '당신의 차례입니다. 번호를 추측하세요.'
          : '상대의 차례입니다. 잠시만 기다려주세요.'
      );
      if (state.turn === user.id && enemyId) {
        setIsGuessing(true);
      } else {
        setIsGuessing(false);
      }
    } else if (state.state === 'waiting') {
      setStatusMsg('두 플레이어가 번호를 설정 중입니다.');
      setIsGuessing(false);
    } else if (state.state === 'finished') {
      if (state.winner) {
        setStatusMsg(
          state.winner === user.id
            ? '게임 종료! 당신이 승리했습니다.'
            : '게임 종료! 상대가 승리했습니다.'
        );
      } else {
        setStatusMsg('게임 종료');
      }
      setIsGuessing(false);
    }
  };

  const handleDisconnect = async () => {
    await leaveRoomAction(roomId);
    await revalidateHomeAction();
  };

  const handleBeforeUnload = () => {
    const data = JSON.stringify({ roomId });
    const blob = new Blob([data], { type: 'application/json' });
    navigator.sendBeacon('/api/leaveRoom', blob);
  };

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  useEffect(() => {
    const socket = setSocket({ path: '/chat', accessToken });
    setSocketClient(socket);

    socket.on('roomJoined', handleRoomJoined);
    socket.on('roomLeave', handleRoomLeave);
    socket.on('gameStart', handleGameStart);
    socket.on('gameState', handleGameState);
    socket.once('disconnect', handleDisconnect);
    window.addEventListener('beforeunload', handleBeforeUnload);

    socket.emit('roomJoined', { roomId, user });

    return () => {
      socket.off('roomJoined', handleRoomJoined);
      socket.off('roomLeave', handleRoomLeave);
      socket.off('gameStart', handleGameStart);
      socket.off('gameState', handleGameState);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      socket.disconnect();
    };
  }, []);

  if (!participants) {
    return null;
  }

  return (
    <>
      {isSettingNumber && (
        <SettingNumberModal
          roomId={roomId}
          onClose={() => setIsSettingNumber(false)}
          onSubmitted={() => setIsSettingNumber(false)}
        />
      )}
      {isGuessing && (
        <GuessNumberModal
          roomId={roomId}
          enemyId={participants.find((p) => p.user.id !== user.id)?.user.id as number}
          onClose={() => setIsGuessing(false)}
          onSubmitted={() => {
            setIsGuessing(false);
          }}
        />
      )}
      <div className='flex justify-evenly items-center w-full'>
        {isGaming && (
          <div className='absolute top-4 left-1/2 -translate-x-1/2 text-sm text-gray-700'>
            {statusMsg}
          </div>
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
          <Button disabled={participants.length !== 2 || isGaming} onClick={sendGameStart}>
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
    </>
  );
}
