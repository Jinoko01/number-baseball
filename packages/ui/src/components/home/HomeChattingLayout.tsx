'use client';

import { useEffect, useState } from 'react';
import { setSocket } from '@/lib/utils/socket';
import { useRef } from 'react';
import { Button } from '../common/Button';
import { getNicknameColor, useSocketStore } from 'utils';

interface HomeChattingLayout {
  accessToken: string;
}

export function HomeChattingLayout({ accessToken }: HomeChattingLayout) {
  const { socketClient, setSocketClient } = useSocketStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const chattingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socket = setSocket({ path: '/chat', accessToken });
    setSocketClient(socket);

    socket.emit('homeJoined');

    const handleHomeMessage = (message: any) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('homeMessage', handleHomeMessage);

    return () => {
      socket.off('homeMessage', handleHomeMessage);
      socket.emit('homeLeave');
      socket.disconnect();
    };
  }, [accessToken]);

  const send = () => {
    socketClient?.emit('homeMessage', { message: input });
    setInput('');
    chattingInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    if (!e.currentTarget.value.trim()) {
      return;
    }

    send();
  };

  return (
    <div className='flex flex-col bg-white rounded-xl h-full p-2 gap-2'>
      <div className='flex flex-col flex-1 overflow-auto'>
        <span className='text-sm text-gray-500 font-bold'>전체 채팅에 참여했습니다.</span>
        {messages.map((message) => (
          <div key={message.sentAt} className=' text-sm font-semibold'>
            <span style={{ color: getNicknameColor(message.senderId) }}>{message.senderName}</span>:{' '}
            <span>{message.message}</span>
          </div>
        ))}
      </div>
      <div className='flex gap-2'>
        <input
          className='flex-1 border rounded-md px-1'
          ref={chattingInputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size='sm' onClick={send}>
          전송
        </Button>
      </div>
    </div>
  );
}
