import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './card';
import ListActions from '../modals/list-actions';
import AddCard from './add-card';
import { useBoardStore } from '@/store/useBoardStore';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface ListProps {
  listId: string;
  index: number;
}

export default function List({ listId, index }: ListProps) {
  const lists = useBoardStore((state) => state.lists);
  const { title, cardIds } = lists[listId];

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <Droppable droppableId={listId} type='card'>
            {(provided, snapshot) => (
              <div
                className={`w-72 min-w-72 max-w-72 rounded-lg p-4 ${snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-list'}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>{title}</h3>
                  <ListActions listId={listId} />
                </div>
                <ScrollArea>
                  <ScrollBar orientation='vertical' />
                  <div className='mt-6 flex max-h-[70dvh] flex-col gap-4'>
                    {cardIds?.map((item, index) => <Card key={item} cardId={item} index={index} />)}
                    {provided.placeholder}
                    <div className='mx-1'>
                      <AddCard listId={listId} />
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
