'use client';

import { Modal } from '../common/Modal';
import { Input } from '../../../@workspace/ui/components/input';
import { useState } from 'react';
import { postGuess } from '@/lib/apis/game/postGuess';
import { useSocketStore } from 'utils';

interface GuessNumberModalProps {
  roomId: number;
  enemyId: number;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function GuessNumberModal({ roomId, enemyId, onClose, onSubmitted }: GuessNumberModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { socketClient } = useSocketStore();

  const validate = (value: string) => {
    const trimmed = value.replace(/\D/g, '');
    if (trimmed.length !== 4) {
      return '4자리 숫자를 입력해주세요.';
    }

    const digits = trimmed.split('').map((c) => Number(c));
    const unique = new Set(digits);
    if (unique.size !== 4) {
      return '중복없는 4자리 숫자여야 합니다.';
    }

    return null;
  };

  const onSubmit = async () => {
    const err = validate(value);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);
    const numbers = value
      .replace(/\D/g, '')
      .split('')
      .map((c) => Number(c));

    try {
      await postGuess({ roomId, enemyId, numbers });
      socketClient?.emit('guessed', { roomId });
      onSubmitted?.();
      onClose();
    } catch (e) {
      setError('추측 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      header={<h1>번호 추측</h1>}
      body={
        <div className='flex flex-col gap-2'>
          <Input
            placeholder='중복없는 4자리 숫자'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={4}
          />
          {error ? <p className='text-red-500 text-sm'>{error}</p> : null}
        </div>
      }
      actions={
        <div className='flex gap-2'>
          <button disabled={loading} className='px-3 py-2 rounded-md border' onClick={onClose}>
            닫기
          </button>
          <button
            disabled={loading}
            className='px-3 py-2 rounded-md bg-blue-600 text-white'
            onClick={onSubmit}
          >
            {loading ? '제출중...' : '제출'}
          </button>
        </div>
      }
    />
  );
}
