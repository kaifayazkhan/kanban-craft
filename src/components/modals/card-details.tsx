'use client';
import React, { useState, useCallback, useRef } from 'react';
import { ChartPie, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import Editor from '../editor/editor';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '../ui/date-picker';
import { useBoardStore } from '@/store/useBoardStore';
import { Label } from '../ui/label';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const Priority = [
  {
    id: 1,
    name: 'Urgent',
    value: 'urgent',
    color: 'text-destructive',
  },
  {
    id: 2,
    name: 'High',
    value: 'high',
    color: 'text-yellow-500',
  },
  {
    id: 3,
    name: 'Medium',
    value: 'medium',
    color: 'text-blue-500',
  },

  {
    id: 4,
    name: 'Low',
    value: 'low',
    color: 'text-text-secondary',
  },
];

interface CardDetailsProps {
  cardId: string;
  handleDialogClose: () => void;
}

export default function CardDetails({ cardId, handleDialogClose }: CardDetailsProps) {
  const { lists, cards, updateCard, updateCardStatus, removeCard } = useBoardStore(
    (state) => state,
  );
  const { title, description, listId, priority, dueDate } = cards[cardId];

  const currentStatus = lists[listId].title;

  const [content, setContent] = useState<string>(description);
  const [date, setDate] = useState<Date | string | undefined>(dueDate);
  const [status, setStatus] = useState(listId);
  const [cardPriority, setCardPriority] = useState(priority);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(() => {
    const inputValue = inputRef.current?.value;
    const updates = {
      title: inputValue?.trim() !== '' ? inputValue : title,
      description: content,
      priority: cardPriority,
      dueDate: (date as string) ?? dueDate,
    };
    updateCard(cardId, updates);
    if (status !== listId) {
      updateCardStatus(cardId, status);
    }
    handleDialogClose();
  }, [
    cardId,
    inputRef,
    content,
    cardPriority,
    date,
    status,
    dueDate,
    updateCard,
    title,
    updateCardStatus,
    listId,
    handleDialogClose,
  ]);

  const handleDelete = useCallback(() => {
    removeCard(cardId);
    handleDialogClose();
  }, [cardId, removeCard, handleDialogClose]);

  return (
    <ScrollArea>
      <ScrollBar orientation='vertical' />
      <div className='max-h-[80dvh] space-y-6'>
        <div className='w-full cursor-text rounded-sm text-2xl font-semibold hover:bg-list'>
          <Input className='sr-only' /> {/* To prevent autofocus on input title input */}
          <Label htmlFor='title' className='sr-only'>
            Task Title
          </Label>
          <Input
            id='title'
            type='text'
            defaultValue={title}
            className='h-auto !border-none bg-transparent px-0 !text-2xl font-semibold shadow-none !outline-none focus-visible:border-none focus-visible:ring-0'
            ref={inputRef}
            aria-label='Edit task name'
          />
        </div>

        <div className='grid gap-4 text-sm sm:text-base lg:grid-cols-2'>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <div className='flex flex-1 items-center gap-2 text-text-secondary'>
                <ChartPie className='size-4' />
                Status
              </div>
              <div className='flex-[2]' aria-label='Change card status'>
                <Select defaultValue={status} onValueChange={setStatus}>
                  <SelectTrigger className='w-48 border text-sm sm:w-60'>
                    <SelectValue placeholder={currentStatus} defaultValue={currentStatus} />
                  </SelectTrigger>
                  <SelectContent className='w-48 sm:w-60'>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {/* All the Lists title are considered as status */}
                      {Object.keys(lists).map((item) => (
                        <SelectItem key={item} value={item}>
                          {lists[item].title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex justify-between'>
              <div className='flex flex-1 items-center gap-2 text-text-secondary'>
                <Calendar className='size-4' />
                Due date
              </div>
              <div className='flex flex-[2]' aria-label='Set due date'>
                <DatePicker date={date} setDate={setDate} className='w-48 sm:w-60' />
              </div>
            </div>
          </div>
          <div>
            <div className='flex justify-between'>
              <div className='flex flex-1 items-center gap-2 text-text-secondary'>
                <Flag className='size-4' />
                Priority
              </div>
              <div className='flex-[2]' aria-label='Set priority'>
                <Select defaultValue={cardPriority} onValueChange={setCardPriority}>
                  <SelectTrigger className='w-48 border text-sm sm:w-60'>
                    <SelectValue placeholder='Select Priority' />
                  </SelectTrigger>
                  <SelectContent className='w-48 sm:w-60'>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      {Priority.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <div className='flex items-center gap-2 text-sm'>
                            {' '}
                            <Flag className={`size-4 ${item.color}`} />
                            {item.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4' aria-label='Update task description'>
          <Label htmlFor='description' className='sr-only'>
            Task Description
          </Label>
          <Editor initialValue={content} onChange={setContent} />
        </div>

        <div className='flex gap-4'>
          <Button variant='destructive' onClick={handleDelete} aria-label='Delete the task'>
            Delete
          </Button>
          <Button
            type='submit'
            variant='primary'
            onClick={handleSave}
            aria-label='Save the updates'
          >
            Save
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
