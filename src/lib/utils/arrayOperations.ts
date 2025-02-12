export const removeFromArray = <T>(array: T[], item: T): T[] =>
  array.filter((element) => element !== item);

export const reorderArray = <T>(array: T[], sourceIndex: number, destinationIndex: number): T[] => {
  const newArray = [...array];
  const [removed] = newArray.splice(sourceIndex, 1);
  newArray.splice(destinationIndex, 0, removed);
  return newArray;
};
