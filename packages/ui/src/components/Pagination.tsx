import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

interface PaginationProps {
  page?: number;
  totalPages?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Pagination({ page = 1, totalPages = 1, hasNext, hasPrev }: PaginationProps) {
  return (
    <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-4'>
      <div className='justify-self-start'>
        {hasPrev && (
          <Link href={`/home?page=${page - 1}`}>
            <Button size='sm' variant='ghost'>
              <ArrowLeft />
            </Button>
          </Link>
        )}
      </div>
      <span className='justify-self-center font-bold'>
        {page} / {totalPages}
      </span>
      <div className='justify-self-end'>
        {hasNext && (
          <Link href={`/home?page=${page + 1}`}>
            <Button size='sm' variant='ghost'>
              <ArrowRight />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
