'use client';
import React from 'react';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import List from './list';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AddList from '../modals/add-list';
import { BOARD_ID, useBoardStore } from '@/store/useBoardStore';

export default function Board() {
  const boards = useBoardStore((state) => state.boards);
  const moveCard = useBoardStore((state) => state.updateCardStatus);
  const reorderList = useBoardStore((state) => state.reorderList);
  const reorderCard = useBoardStore((state) => state.reorderCard);

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, type, source, destination } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'list') {
      return reorderList(source.index, destination.index, BOARD_ID);
    }

    if (source.droppableId === destination.droppableId) {
      return reorderCard(source.index, destination.index, destination.droppableId);
    }

    moveCard(draggableId, destination?.droppableId, destination.index);
  };

  return (
    <ScrollArea className='w-full whitespace-nowrap'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='board' type='list' direction='horizontal'>
          {(provided) => (
            <div
              className='flex w-max gap-6 md:gap-12'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {boards[BOARD_ID]?.listIds.map((item, i) => (
                <List key={item} listId={item} index={i} />
              ))}
              {provided.placeholder}
              <AddList boardId={BOARD_ID} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
