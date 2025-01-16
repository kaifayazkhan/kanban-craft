import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useBoardStore } from '@/store/useBoardStore';
import { CardTypes } from '@/lib/types';

interface AddCardProps {
  listId: string;
}

export default function AddCard({ listId }: AddCardProps) {
  const [title, setTitle] = useState<string>('');
  const { lists, addCard, updateList } = useBoardStore((state) => state);
  const [isAddCard, setAddCard] = useState(false);

  const toggleAddCard = () => setAddCard((prev) => !prev);

  const handleAddCard = () => {
    if (title.trim() === '') {
      toggleAddCard();
      return;
    }
    const newCardId = crypto.randomUUID();

    const newCardData: CardTypes = {
      id: newCardId,
      title: title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listId: listId,
      description: '',
      dueDate: '',
      status: listId,
      priority: '',
    };

    addCard({ [newCardId]: newCardData });
    updateList(listId, { cardIds: [...lists[listId].cardIds, newCardId] });
    setTitle('');
    toggleAddCard();
  };

  return (
    <div className='w-full'>
      {isAddCard ? (
        <div className='space-y-3'>
          <div>
            <Label title='Card name' className='sr-only' />
            <Input
              type='text'
              placeholder='Enter title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={toggleAddCard}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} disabled={title === ''}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button onClick={toggleAddCard}>Add Card</Button>
        </div>
      )}
    </div>
  );
}
