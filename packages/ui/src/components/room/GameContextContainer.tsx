'use client';

import { useEffect, useState } from 'react';
import { Input } from '../../../@workspace/ui/components/input';
import { getNicknameColor, useSocketStore } from 'utils';
import { Button } from '../common/Button';
import { useRef } from 'react';

interface GameContextContainerProps {
  roomId: number;
}

export function GameContextContainer({ roomId }: GameContextContainerProps) {
  const { socketClient, setSocketClient } = useSocketStore();
  const [contexts, setContexts] = useState<any[]>([]);
  const chattingInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  const send = () => {
    socketClient?.emit('roomMessage', { roomId, message: input });
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

  useEffect(() => {
    if (!socketClient) {
      return;
    }

    socketClient.on('roomMessage', (message: any) => {
      setContexts((prev) => [...prev, message]);
    });
  }, [socketClient]);

  return (
    <div className='flex flex-col bg-white rounded-md h-full p-2 gap-2 shadow-md border-3 border-blue-200 max-w-3xl w-full min-h-48'>
      <div className='flex flex-col flex-1 overflow-auto'>
        {contexts.map((context) => (
          <div key={context.sentAt} className=' text-sm font-semibold'>
            <span style={{ color: getNicknameColor(context.senderId) }}>{context.senderName}</span>:{' '}
            <span>{context.message}</span>
          </div>
        ))}
      </div>
      <div className='flex items-center gap-4'>
        <Input
          className='border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300'
          ref={chattingInputRef}
          placeholder='메시지를 입력해주세요.'
          onKeyDown={handleKeyDown}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={send}>
          <span className='font-semibold'>전송</span>
        </Button>
      </div>
    </div>
  );
}
