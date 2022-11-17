export const convertDatabaseDate = (date: Date) => {
  const stringDate = date.toString();

  const year = stringDate.substring(0, 4);
  const month = stringDate.substring(5, 7);
  const day = stringDate.substring(8, 10);

  return `${day}/${month}`;
};
