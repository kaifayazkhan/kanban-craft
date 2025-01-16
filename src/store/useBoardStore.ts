import { create } from 'zustand';
import { createJSONStorage, persist, devtools } from 'zustand/middleware';
import { BoardDatatype, BoardTypes, CardTypes, ListTypes } from '@/lib/types';
import { currentTimeStamp } from '@/lib/utils/timestamp';
import { reorderArray, removeFromArray } from '@/lib/utils/arrayOperations';

type AddActions = {
  addBoard: (data: Record<string, BoardTypes>) => void;
  addList: (data: Record<string, ListTypes>) => void;
  addCard: (data: Record<string, CardTypes>) => void;
};

type UpdateActions = {
  updateBoard: (boardId: string, data: Partial<BoardTypes>) => void;
  updateList: (listId: string, data: Partial<ListTypes>) => void;
  updateCard: (cardId: string, data: Partial<CardTypes>) => void;
  updateCardStatus: (cardId: string, destinationListId: string, destinationIndex?: number) => void;
};

type RemoveActions = {
  removeBoard: (boardId: string) => void;
  removeList: (listId: string) => void;
  removeCard: (cardId: string) => void;
};

type ReorderActions = {
  reorderList: (sourceIndex: number, destinationIndex: number, boardId: string) => void;
  reorderCard: (sourceIndex: number, destinationIndex: number, listId: string) => void;
};

type BoardAction = AddActions & UpdateActions & RemoveActions & ReorderActions;

export const BOARD_ID = 'board-1' as const;

const initialState: BoardDatatype = {
  boards: {
    [BOARD_ID]: {
      id: BOARD_ID,
      title: 'Project Board',
      listIds: [],
      createdAt: currentTimeStamp(),
      updatedAt: currentTimeStamp(),
    },
  },
  lists: {},
  cards: {},
} as const;

type BoardType = BoardDatatype & BoardAction;

export const useBoardStore = create<BoardType>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        addBoard: (data) => set((state) => ({ boards: { ...state.boards, ...data } })),
        addList: (data) => set((state) => ({ lists: { ...state.lists, ...data } })),
        addCard: (data) => set((state) => ({ cards: { ...state.cards, ...data } })),

        updateBoard: (id, data) =>
          set((state) => {
            const board = state.boards[id];
            if (!board) throw new Error(`Board with id ${id} does not exist`);

            return {
              boards: {
                ...state.boards,
                [id]: {
                  ...board,
                  ...data,
                  updatedAt: currentTimeStamp(),
                },
              },
            };
          }),

        updateList: (id, data) =>
          set((state) => {
            const list = state.lists[id];
            if (!list) throw new Error(`List with id ${id} does not exist`);

            return {
              lists: {
                ...state.lists,
                [id]: {
                  ...list,
                  ...data,
                  updatedAt: currentTimeStamp(),
                },
              },
            };
          }),

        updateCard: (id, data) =>
          set((state) => {
            const card = state.cards[id];
            if (!card) throw new Error(`Card with id ${id} does not exist`);

            return {
              cards: {
                ...state.cards,
                [id]: {
                  ...card,
                  ...data,
                  updatedAt: currentTimeStamp(),
                },
              },
            };
          }),

        updateCardStatus: (cardId, destinationListId, destinationIndex) =>
          set((state) => {
            const card = state.cards[cardId];
            if (!card) throw new Error(`Card with id ${cardId} does not exist`);
            if (card.listId === destinationListId) return state;

            const currentListId = card.listId;
            const destinationCardIds = [...state.lists[destinationListId].cardIds];

            if (destinationIndex !== undefined) {
              destinationCardIds.splice(destinationIndex, 0, cardId);
            } else {
              destinationCardIds.push(cardId);
            }

            return {
              lists: {
                ...state.lists,
                [currentListId]: {
                  ...state.lists[currentListId],
                  cardIds: removeFromArray(state.lists[currentListId].cardIds, cardId),
                  updatedAt: currentTimeStamp(),
                },
                [destinationListId]: {
                  ...state.lists[destinationListId],
                  cardIds: destinationCardIds,
                  updatedAt: currentTimeStamp(),
                },
              },
              cards: {
                ...state.cards,
                [cardId]: {
                  ...card,
                  listId: destinationListId,
                  status: destinationListId,
                  updatedAt: currentTimeStamp(),
                },
              },
            };
          }),

        removeBoard: (id) =>
          set((state) => {
            const { [id]: removeBoard, ...remainingBoards } = state.boards;
            const listIds = removeBoard.listIds;
            // Remove all associated lists of the board
            listIds.forEach((item) => {
              state.removeList(item);
            });
            return {
              boards: {
                // Reset the deleted board to its initial state (empty lists)
                // to maintain the current flow where the same board is displayed on the home page.
                [removeBoard.id]: {
                  ...removeBoard,
                  listIds: [],
                },
                ...remainingBoards,
              },
            };
          }),

        removeList: (id) =>
          set((state) => {
            const { [id]: removedList, ...remainingLists } = state.lists;
            const boardId = removedList.boardId;

            // Remove all associated cards of the list
            removedList.cardIds.forEach((item) => {
              state.removeCard(item);
            });

            return {
              boards: {
                ...state.boards,
                [boardId]: {
                  ...state.boards[boardId],
                  listIds: removeFromArray(state.boards[boardId].listIds, id),
                },
              },
              lists: remainingLists,
            };
          }),

        removeCard: (cardId) =>
          set((state) => {
            const { [cardId]: removedCard, ...remainingCards } = state.cards;
            const currentListId = removedCard.listId;
            return {
              cards: remainingCards,
              lists: {
                ...state.lists,
                [currentListId]: {
                  ...state.lists[currentListId],
                  cardIds: removeFromArray(state.lists[currentListId].cardIds, cardId),
                },
              },
            };
          }),

        reorderList: (sourceIndex, destinationIndex, boardId) =>
          set((state) => {
            return {
              boards: {
                ...state.boards,
                [boardId]: {
                  ...state.boards[boardId],
                  listIds: reorderArray(
                    state.boards[boardId].listIds,
                    sourceIndex,
                    destinationIndex,
                  ),
                },
              },
            };
          }),
        reorderCard: (sourceIndex, destinationIndex, listId) =>
          set((state) => {
            return {
              lists: {
                ...state.lists,
                [listId]: {
                  ...state.lists[listId],
                  cardIds: reorderArray(state.lists[listId].cardIds, sourceIndex, destinationIndex),
                  updatedAt: currentTimeStamp(),
                },
              },
            };
          }),
      }),
      {
        name: 'board-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          boards: state.boards,
          lists: state.lists,
          cards: state.cards,
        }),
      },
    ),
  ),
);
