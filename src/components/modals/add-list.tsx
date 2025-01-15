import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useBoardStore } from '@/store/useBoardStore';
import { ListTypes } from '@/lib/types';

interface AddListProps {
  boardId: string;
}

export default function AddList({ boardId }: AddListProps) {
  const [listName, setListName] = useState<string>('');
  const { boards, updateBoard, addList } = useBoardStore((state) => state);

  const handleAddList = () => {
    const newListId = crypto.randomUUID();

    const newListData: ListTypes = {
      id: newListId,
      title: listName,
      boardId: boardId,
      cardIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addList({ [newListId]: newListData });
    updateBoard(boardId, { listIds: [...boards[boardId].listIds, newListId] });
    setListName('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex h-fit w-72 min-w-72 max-w-72 rounded-lg bg-list'>
          <Button variant='ghost' size='lg' className='w-full'>
            <Plus className='size-4' />
            Add List
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[90%] rounded-md sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-start'>Add List</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div>
          <Label htmlFor='addList' className='sr-only'>
            Link
          </Label>
          <Input id='addList' onChange={(e) => setListName(e.target.value)} />
        </div>
        <DialogFooter className='flex flex-row gap-2 sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type='button' variant='primary' onClick={handleAddList}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
