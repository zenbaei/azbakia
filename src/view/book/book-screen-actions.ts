import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {SubGenre} from 'domain/genre/genre';
import {Cart} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {modificationResult} from 'zenbaei-js-lib/types';
import {isEmpty} from 'zenbaei-js-lib/utils';
import {pageSize} from '../../../app.config';

export const _incrementCart = (bookId: string, cart: Cart[]): Cart[] => {
  let cartClone = [...cart];
  const index: number = cart.findIndex((val) => val.bookId === bookId);
  if (index >= 0) {
    cartClone[index].nuOfCopies = cartClone[index].nuOfCopies + 1;
  } else {
    cartClone.push({bookId: bookId, nuOfCopies: 1});
  }
  return cartClone;
};

export const _updateCart = async (
  bookId: string,
  availableCopies: number,
  cart: Cart[],
  addOrSub: number,
): Promise<boolean> => {
  const result1: modificationResult = await userService.updateCart(
    global.user._id,
    cart,
  );
  const result2: modificationResult = await bookService.updateAvailableCopies(
    bookId,
    availableCopies + addOrSub,
  );
  return result1.modified === 1 && result2.modified === 1;
};

export const addToCart = async (
  bookId: string,
  availableCopies: number,
  cart: Cart[],
  callback: cartCallback,
): Promise<void> => {
  const modifiedCart = _incrementCart(bookId, cart);
  const isUpdated: boolean = await _updateCart(
    bookId,
    availableCopies,
    modifiedCart,
    -1,
  );
  if (isUpdated) {
    callback(modifiedCart);
  }
};

/**
 *
 * @returns the updated array
 */
const _addOrRemoveFromArr = (id: string, ids: string[]): string[] => {
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
  const modifiedFavs = _addOrRemoveFromArr(bookId, favs);
  const isAdded: boolean = modifiedFavs.length > favs.length;
  const result: modificationResult = isAdded
    ? await userService.addToFav(global.user._id, bookId)
    : await userService.removeFromFav(global.user._id, bookId);
  if (result.modified === 1) {
    callback(modifiedFavs, isAdded);
  }
};

export const loadBooks = (
  subGenre: string,
  skip: number,
  limit: number,
): Promise<Book[]> => {
  return isEmpty(subGenre)
    ? bookService.findByNewArrivals(skip, limit)
    : bookService.findByGenre(subGenre, skip, limit);
};

export const calculateMaxPageSize = async (
  genre: SubGenre,
): Promise<number> => {
  const result = isEmpty(genre?.nameEn)
    ? await bookService.findByNewArrivals()
    : await bookService.findByGenre(genre.nameEn);
  return Math.ceil(result.length / pageSize);
};

export const findBook = async (id: string): Promise<Book> => {
  return bookService.findOneById(id);
};

export const searchBooks = async (name: string): Promise<Book[]> => {
  return bookService.findAllLike('name', name);
};

export type cartCallback = (modifiedCart: Cart[]) => void;
type favCallback = (modifiedFavs: string[], isAdded: boolean) => void;
