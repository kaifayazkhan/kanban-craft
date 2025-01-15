import React, { useState } from 'react';
import CardDetails from '../modals/card-details';
import {
  Dialog,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from '../ui/dialog';
import { useBoardStore } from '@/store/useBoardStore';

interface CardProps {
  cardId: string;
}

export default function Card({ cardId }: CardProps) {
  const cards = useBoardStore((state) => state.cards);
  const { title } = cards[cardId];

  const [isCardDialogOpen, setCardDialogOpen] = useState(false);

  const toggleCardDialogOpen = () => setCardDialogOpen((prev) => !prev);

  return (
    <Dialog open={isCardDialogOpen} onOpenChange={setCardDialogOpen}>
      <DialogTrigger>
        <div
          className='cursor-move space-y-3 rounded-lg border bg-card px-3 py-4 text-start hover:bg-accent'
          onClick={toggleCardDialogOpen}
        >
          <h3 className='truncate text-base font-medium'>{title.slice(0, 30)}</h3>
        </div>
      </DialogTrigger>
      <DialogContent
        className='max-w-[90%] rounded-md p-4 sm:p-8 md:max-w-[80%]'
        aria-label='Task Details'
      >
        <DialogHeader>
          <DialogTitle className='text-start'>Card Info</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <CardDetails cardId={cardId} handleDialogClose={toggleCardDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
