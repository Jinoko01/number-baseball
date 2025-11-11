import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../@workspace/ui/components/dialog';
import { Label } from '../../@workspace/ui/components/label';
import { Input } from '../../@workspace/ui/components/input';
import { Button } from './Button';

export function CreateRoomDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'>
          <span className='text-xs font-semibold'>방 만들기</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle>새로운 게임 방 만들기</DialogTitle>
          <DialogDescription className='text-gray-600 text-sm'>
            친구와 함께 숫자 야구 게임을 즐길 방을 만들어보세요.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <Label className='font-semibold' htmlFor='roomName'>
            방 이름
          </Label>
          <Input id='roomName' type='text' placeholder='예: 숫자 야구 한판 하실분?' />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button size='sm' variant='outline'>
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size='sm'>만들기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
