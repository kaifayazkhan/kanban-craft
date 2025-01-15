import React from 'react';
import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';

export default function Header() {
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
        <Button variant='destructive'>
          <Trash />
          Reset Board
        </Button>
      </div>
    </header>
  );
}
