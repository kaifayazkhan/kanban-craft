import React from 'react';
import { Layout, Trash } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  return (
    <header className='sticky top-0 bg-white'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Layout className='text-3xl' />
          <div className='text-3xl font-bold'>Kanban Craft</div>
        </div>
        <Button variant='destructive'>
          <Trash />
          Reset Board
        </Button>
      </div>
    </header>
  );
}
