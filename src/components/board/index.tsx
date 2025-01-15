'use client';
import React from 'react';
import List from './list';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AddList from '../modals/add-list';
import { useBoardStore } from '@/store/useBoardStore';

const BOARD_ID = 'board-1' as const;

export default function Board() {
  const boards = useBoardStore((state) => state.boards);

  return (
    <ScrollArea className='w-full whitespace-nowrap'>
      <div className='flex w-max gap-6 md:gap-12'>
        {boards[BOARD_ID].listIds.map((item) => (
          <List key={item} listId={item} />
        ))}
        <AddList boardId={BOARD_ID} />
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
