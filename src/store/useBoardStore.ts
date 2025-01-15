import { create } from 'zustand';
import { createJSONStorage, persist, devtools } from 'zustand/middleware';
import { BoardDatatype, BoardTypes, CardTypes, ListTypes } from '@/lib/types';
import { currentTimeStamp } from '@/lib/utils/timestamp';

type AddActions = {
  addBoard: (data: Record<string, BoardTypes>) => void;
  addList: (data: Record<string, ListTypes>) => void;
  addCard: (data: Record<string, CardTypes>) => void;
};

type UpdateActions = {
  updateBoard: (boardId: string, data: Partial<BoardTypes>) => void;
  updateList: (listId: string, data: Partial<ListTypes>) => void;
  updateCard: (cardId: string, data: Partial<CardTypes>) => void;
  updateCardStatus: (cardId: string, destinationListId: string) => void;
};

type RemoveActions = {
  removeBoard: (boardId: string) => void;
  removeList: (listId: string) => void;
  removeCard: (cardId: string) => void;
};

type BoardAction = AddActions & UpdateActions & RemoveActions;

const initialState: BoardDatatype = {
  boards: {
    'board-1': {
      id: 'board-1',
      title: 'Project Board',
      listIds: [],
      createdAt: currentTimeStamp(),
      updatedAt: currentTimeStamp(),
    },
  },
  lists: {},
  cards: {},
};

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

        updateCardStatus: (cardId, destinationListId) =>
          set((state) => {
            if (!state.cards[cardId]) throw new Error(`Card with id ${cardId} does not exist`);

            const currentCardData = {
              ...state.cards[cardId],
            };

            if (currentCardData.listId === destinationListId) return state;

            const currentListId = currentCardData.listId;

            return {
              lists: {
                ...state.lists,
                [currentListId]: {
                  ...state.lists[currentListId],
                  cardIds: state.lists[currentListId].cardIds.filter((id) => id !== cardId),
                },
                [destinationListId]: {
                  ...state.lists[destinationListId],
                  cardIds: [...state.lists[destinationListId].cardIds, cardId],
                },
              },
              cards: {
                ...state.cards,
                [cardId]: {
                  ...currentCardData,
                  listId: destinationListId,
                  status: destinationListId,
                  updatedAt: currentTimeStamp(),
                },
              },
            };
          }),

        removeBoard: (id) =>
          set((state) => {
            const {
              [id]: {},
              ...remainingBoards
            } = state.boards;
            const listIds = state.boards[id].listIds;
            listIds.forEach((item) => {
              state.removeList(item);
            });
            return { boards: remainingBoards };
          }),

        removeList: (id) =>
          set((state) => {
            const {
              [id]: {},
              ...remainingLists
            } = state.lists;
            const currentList = state.lists[id];
            const boardList = state.boards[currentList.boardId].listIds.filter(
              (item) => item !== id,
            );
            const updatedBoard = { ...state.boards[currentList.boardId], listIds: boardList };
            const cardIds = state.lists[id].cardIds;
            cardIds.forEach((item) => {
              state.removeCard(item);
            });
            return {
              boards: {
                ...state.boards,
                [currentList.boardId]: updatedBoard,
              },
              lists: remainingLists,
            };
          }),

        removeCard: (cardId) =>
          set((state) => {
            const {
              [cardId]: {},
              ...remainingCards
            } = state.cards;
            const currentListId = state.cards[cardId].listId;
            return {
              cards: remainingCards,
              lists: {
                ...state.lists,
                [currentListId]: {
                  ...state.lists[currentListId],
                  cardIds: state.lists[currentListId].cardIds.filter((id) => id !== cardId),
                },
              },
            };
          }),
      }),
      {
        name: 'board-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ boards: state.boards, lists: state.lists, cards: state.cards }),
      },
    ),
  ),
);
