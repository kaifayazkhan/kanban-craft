export type BoardDatatype = {
  boards: Record<string, BoardTypes>;
  lists: Record<string, ListTypes>;
  cards: Record<string, CardTypes>;
};

export type BoardTypes = {
  id: string;
  title: string;
  listIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type ListTypes = {
  id: string;
  title: string;
  cardIds: string[];
  boardId: string;
  createdAt: string;
  updatedAt: string;
};

export type CardTypes = {
  id: string;
  title: string;
  listId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  status: string;
  priority: string;
};
