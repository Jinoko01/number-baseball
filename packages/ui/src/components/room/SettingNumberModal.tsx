'use client';

import { Modal } from '../common/Modal';
import { Input } from '../../../@workspace/ui/components/input';

interface SettingNumberModalProps {
  roomId: number;
}

export function SettingNumberModal({ roomId }: SettingNumberModalProps) {
  return <Modal header={<h1>번호 설정</h1>} body={<Input placeholder='번호를 입력해주세요.' />} />;
}
