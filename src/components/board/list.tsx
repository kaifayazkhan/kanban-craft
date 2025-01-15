import React from 'react';
import Card from './card';
import ListActions from '../modals/list-actions';
import AddCard from './add-card';
import { useBoardStore } from '@/store/useBoardStore';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface ListProps {
  listId: string;
}

export default function List({ listId }: ListProps) {
  const lists = useBoardStore((state) => state.lists);
  const { title, cardIds } = lists[listId];

  return (
    <div className='w-72 min-w-72 max-w-72 rounded-lg bg-list p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <ListActions listId={listId} />
      </div>
      <ScrollArea>
        <ScrollBar orientation='vertical' />
        <div className='mt-6 flex max-h-[70dvh] flex-col gap-4'>
          {cardIds?.map((item) => <Card key={item} cardId={item} />)}
          <AddCard listId={listId} />
        </div>
      </ScrollArea>
    </div>
  );
}
