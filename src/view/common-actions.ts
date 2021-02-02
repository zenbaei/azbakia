import {favOrCart, userService} from 'user/user-service';
import {getAppTheme} from 'zenbaei-js-lib/theme';

export const getIconColor = (bookName: string, books: string[]): string => {
  if (books.find((val) => val === bookName)) {
    return getAppTheme().primary;
  }
  return getAppTheme().secondary;
};

export const updateFavOrCart = async (
  bookName: string,
  books: string[],
  attribute: favOrCart,
): Promise<string[]> => {
  let booksClone = [...books];
  const index: number = books.findIndex((val) => val === bookName);
  if (index >= 0) {
    booksClone.splice(index, 1);
  } else {
    booksClone = [...books, bookName];
  }
  const result = await userService.updateFavOrCart(
    global.user._id,
    booksClone,
    attribute,
  );
  return result.updated > 0 ? booksClone : books;
};
