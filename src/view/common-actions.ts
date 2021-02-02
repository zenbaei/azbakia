import {userService} from 'user/user-service';
import {getAppTheme} from 'zenbaei-js-lib/theme';

export const getFavIconColor = (
  bookName: string,
  favBooks: string[],
): string => {
  if (favBooks.find((val) => val === bookName)) {
    return getAppTheme().primary;
  }
  return getAppTheme().secondary;
};

export const addRemoveFromFav = async (
  bookName: string,
  favBooks: string[],
): Promise<string[]> => {
  let favBooksClone = [...favBooks];
  const index: number = favBooks.findIndex((val) => val === bookName);
  if (index >= 0) {
    favBooksClone.splice(index, 1);
  } else {
    favBooksClone = [...favBooks, bookName];
  }
  const result = await userService.addToFavBook(global.user._id, favBooksClone);
  return result.updated > 0 ? favBooksClone : favBooks;
};
