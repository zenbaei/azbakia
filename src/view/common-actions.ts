import {userService} from 'user/user-service';

export const getFavIconColor = (
  bookName: string,
  favBooks: string[],
): string => {
  if (favBooks.find((val) => val === bookName)) {
    return 'white';
  }
  return 'red';
};

export const addToFav = (
  bookName: string,
  favBooks: string[],
): Promise<string[]> | void => {
  if (favBooks.find((val) => val === bookName)) {
    return;
  }
  const favs: string[] = [...favBooks, bookName];
  return userService.addToFavBook(global.user._id, favs).then(() => favs);
};
