import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {Cart} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {modificationResult} from 'zenbaei-js-lib/types';
import {isEmpty} from 'zenbaei-js-lib/utils';
import {pageSize} from '../../../app.config';

export const getIconColor = (
  id: string,
  ids: string[],
  theme: AppThemeInterface,
): string => {
  if (ids.find((val) => val === id)) {
    return theme.secondary;
  }
  return theme.primary;
};

/**
 *
 * @param bookId
 * @param cart
 * @returns - the modified cart and the amount of 1 in case of adding to cart or the cart's amount
 * in case of removing from cart
 *
 */
export const _pushOrPopCart = (
  bookId: string,
  cart: Cart[],
): {modifiedCart: Cart[]; cartAmount: number} => {
  let amount: number = -1;
  let cartClone = [...cart];
  const index: number = cart.findIndex((val) => val.bookId === bookId);
  if (index === -1) {
    cartClone.push({bookId: bookId, amount: 1});
  } else {
    const crt = cartClone.splice(index, 1);
    amount = crt[0].amount;
  }
  return {modifiedCart: cartClone, cartAmount: amount};
};

export const _updateCart = async (cart: Cart[]): Promise<boolean> => {
  const result: modificationResult = await userService.updateCart(
    global.user._id,
    cart,
  );
  return result.modified === 1;
};

export const _updateInventory = async (
  book: Book,
  amount: number,
): Promise<boolean> => {
  const result: modificationResult = await bookService.updateInventory(
    book._id,
    book.inventory + amount,
  );
  return result.modified === 1;
};

export const addOrRmvFrmCart = async (
  book: Book,
  cart: Cart[],
  callback: cartCallback,
): Promise<void> => {
  const {modifiedCart, cartAmount} = _pushOrPopCart(book._id, cart);
  const isCopiesUpdated: boolean = await _updateInventory(book, cartAmount);
  const isCartUpdated: boolean = await _updateCart(modifiedCart);
  if (isCartUpdated && isCopiesUpdated) {
    callback(modifiedCart);
  }
};

/**
 * If id exists in provided ids then remove, otherwise add.
 * @returns - the updated array
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
export const loadBooksByPage = (
  genre: string,
  page: number,
): Promise<Book[]> => {
  return isEmpty(genre)
    ? bookService.findByNewArrivals(page * pageSize, pageSize)
    : bookService.findByGenre(genre, page * pageSize, pageSize);
};

/**
 * Loads books respecting the page size
 * @param genre
 * @param clb
 */
export const loadFirstBooksPageAndCalcTotalPagesNumber = async (
  genre: string,
  clb: (result: Book[], totalPagesNumber: number) => void,
): Promise<void> => {
  const result = isEmpty(genre)
    ? await bookService.findByNewArrivals()
    : await bookService.findByGenre(genre);
  let resultPerPageSize =
    result.length >= pageSize ? result.slice(0, pageSize) : result;
  clb(resultPerPageSize, Math.ceil(result.length / pageSize));
};

export const loadFirstSearchedBooksPageAndCalcTotalPageNumber = async (
  searchToken: string,
  clb: (result: Book[], totalPagesNumber: number) => void,
): Promise<void> => {
  const result = await bookService.findAllLike('name', searchToken, true);
  let resultPerPageSize =
    result.length >= pageSize ? result.slice(0, pageSize) : result;
  clb(resultPerPageSize, Math.ceil(result.length / pageSize));
};

export const searchBooksProjected = async (name: string): Promise<Book[]> => {
  return bookService.findAllLike('name', name, true, {
    projection: {_id: 1, name: 1},
  });
};

export const loadSearchedBooksByPage = async (
  name: string,
  page: number,
): Promise<Book[]> => {
  return bookService.findAllLike(
    'name',
    name,
    true,
    undefined,
    page * pageSize,
    pageSize,
  );
};

export type cartCallback = (modifiedCart: Cart[]) => void;
type favCallback = (modifiedFavs: string[], isAdded: boolean) => void;

export const findBook = (id: string): Promise<Book> =>
  bookService.findOne('_id', id);
