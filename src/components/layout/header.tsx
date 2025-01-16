'use client';
import React from 'react';
import Image from 'next/image';
import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { BOARD_ID, useBoardStore } from '@/store/useBoardStore';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const resetBoard = useBoardStore((state) => state.removeBoard);
  const { toast } = useToast();

  const handleResetBoard = () => {
    resetBoard(BOARD_ID);
    toast({
      description: 'The board has been successfully reset.',
      variant: 'destructive',
    });
  };

  return (
    <header className='sticky top-0 z-10 bg-white'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Image
            src='/logo-black.png'
            width={210}
            height={100}
            alt='Kanban Craft Logo'
            className='h-auto w-32 object-contain sm:w-52'
            priority
          />
        </div>
        <Button variant='destructive' onClick={handleResetBoard}>
          <Trash />
          Reset Board
        </Button>
      </div>
    </header>
  );
}
