import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {SubGenre} from 'domain/genre/genre';
import {Cart} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {modificationResult} from 'zenbaei-js-lib/types';
import {isEmpty, Logger} from 'zenbaei-js-lib/utils';
import {pageSize} from '../../../app.config';

export const getIconColor = (
  id: string,
  ids: string[],
  theme: AppThemeInterface,
): string => {
  if (ids.find((val) => val === id)) {
    return theme.primary;
  }
  return theme.secondary;
};

export const _pushOrPopCart = (bookId: string, cart: Cart[]): Cart[] => {
  let cartClone = [...cart];
  const index: number = cart.findIndex((val) => val.bookId === bookId);
  if (index === -1) {
    cartClone.push({bookId: bookId, nuOfCopies: 1});
  } else {
    cartClone.splice(index, 1);
  }
  return cartClone;
};

export const _updateCart = async (cart: Cart[]): Promise<boolean> => {
  const result: modificationResult = await userService.updateCart(
    global.user._id,
    cart,
  );
  return result.modified === 1;
};

export const _updateAvailableCopies = async (
  book: Book,
  addOrSub: number,
): Promise<boolean> => {
  const result: modificationResult = await bookService.updateAvailableCopies(
    book._id,
    book.availableCopies + addOrSub,
  );
  return result.modified === 1;
};

export const addOrRmvFrmCart = async (
  book: Book,
  cart: Cart[],
  addOrRmv: 1 | -1,
  callback: cartCallback,
): Promise<void> => {
  const modifiedCart = _pushOrPopCart(book._id, cart);
  const isCartUpdated: boolean = await _updateCart(modifiedCart);
  const isCopiesUpdated: boolean = await _updateAvailableCopies(
    book,
    -addOrRmv,
  );
  if (isCartUpdated && isCopiesUpdated) {
    callback(modifiedCart);
  }
};

/**
 *
 * @returns the updated array
 */
export const _pushOrPop = (id: string, ids: string[]): string[] => {
  let arrClone = [...ids];
  const index: number = ids.findIndex((val) => val === id);
  if (index >= 0) {
    arrClone.splice(index, 1);
  } else {
    arrClone = [...ids, id];
  }
  return arrClone;
};

export const updateFav = async (
  bookId: string,
  favs: string[],
  callback: favCallback,
) => {
  const modifiedFavs = _pushOrPop(bookId, favs);
  const isAdded: boolean = modifiedFavs.length > favs.length;
  const result: modificationResult = isAdded
    ? await userService.addToFav(global.user._id, bookId)
    : await userService.removeFromFav(global.user._id, bookId);
  if (result.modified === 1) {
    callback(modifiedFavs, isAdded);
  }
};

/**
 *
 * @param subGenre
 * @param page - starts from zero
 * @returns
 */
export const loadBooks = (subGenre: string, page: number): Promise<Book[]> => {
  return isEmpty(subGenre)
    ? bookService.findByNewArrivals(page * pageSize, pageSize)
    : bookService.findByGenre(subGenre, page * pageSize, pageSize);
};

export const calculateMaxPageSize = async (
  genre: SubGenre,
): Promise<number> => {
  Logger.debug('book-screen-actions', 'calculateMaxPageSize');
  const result = isEmpty(genre?.nameEn)
    ? await bookService.findByNewArrivals()
    : await bookService.findByGenre(genre.nameEn);
  return Math.ceil(result.length / pageSize);
};

export const searchBooks = async (name: string): Promise<Book[]> => {
  return bookService.findAllLike('name', name);
};

export type cartCallback = (modifiedCart: Cart[]) => void;
type favCallback = (modifiedFavs: string[], isAdded: boolean) => void;

export const findBook = (id: string): Promise<Book> =>
  bookService.findOne('_id', id);
