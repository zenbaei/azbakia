import {Book, request} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {Cart} from 'domain/user/cart';
import {userService} from 'domain/user/user-service';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {inOp, modificationResult} from 'zenbaei-js-lib/types';
import {isEmpty} from 'zenbaei-js-lib/utils';

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

export const getCartIconColor = (
  bookId: string,
  cart: Cart[],
  theme: AppThemeInterface,
): string => {
  if (isInCart(bookId, cart)) {
    return theme.secondary;
  }
  return theme.primary;
};

export const isInCart = (bookId: string, cart: Cart[]): boolean => {
  const cr = cart.find((c) => c.bookId === bookId);
  return cr ? true : false;
};

/**
 *
 * @param bookId
 * @param cart
 * @returns - the modified cart and the quantity of 1 in case of adding to cart or the cart's amount
 * in case of removing from cart
 *
 */
export const _pushOrPopCart = (
  book: Book,
  cart: Cart[],
): {modifiedCart: Cart[]; cartQuantity: number} => {
  let quantity: number = -1;
  let cartClone = [...cart];
  const index: number = cart.findIndex((val) => val.bookId === book._id);
  if (index === -1) {
    cartClone.push({bookId: book._id, quantity: 1});
  } else {
    const crt = cartClone.splice(index, 1);
    quantity = crt[0].quantity;
  }
  return {modifiedCart: cartClone, cartQuantity: quantity};
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
  quantity: number,
): Promise<boolean> => {
  const result: modificationResult = await bookService.updateInventory(
    book._id,
    book.inventory + quantity,
  );
  return result.modified === 1;
};

export const addOrRmvFrmCart = async (
  book: Book,
  cart: Cart[],
  callback: cartCallback,
): Promise<void> => {
  const {modifiedCart, cartQuantity} = _pushOrPopCart(book, cart);
  const isCopiesUpdated: boolean = await _updateInventory(book, cartQuantity);
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
 * @param page - starts from zero
 */
export const findBooksByPage = async (
  cart: Cart[],
  genre: string,
  page: number,
  pageSize: number,
): Promise<Book[]> => {
  const bookNames = await findCartBookNames(cart);
  return isEmpty(genre)
    ? bookService.findByNewArrivals(bookNames, page * pageSize, pageSize)
    : bookService.findByGenre(bookNames, genre, page * pageSize, pageSize);
};

/**
 * Finds books by genere or newArrivals and return items for 1st page.
 */
export const find1stBooksPageAndPageSize = async (
  cart: Cart[],
  genre: string,
  pageSize: number,
  clb: searchResultCallback,
): Promise<void> => {
  const bookNames = await findCartBookNames(cart);
  const result = isEmpty(genre)
    ? await bookService.findByNewArrivals(bookNames)
    : await bookService.findByGenre(bookNames, genre);
  let firstPageBooks =
    result.length >= pageSize ? result.slice(0, pageSize) : result;
  clb(firstPageBooks, Math.ceil(result.length / pageSize));
};

/**
 * Finds books by search token and return items for 1st page.
 * @param searchToken
 * @param clb
 */
export const find1stSearchedBooksPageAndPageSize = async (
  searchToken: string,
  pageSize: number,
  clb: searchResultCallback,
): Promise<void> => {
  const result = await bookService.findBySearchToken(searchToken);
  let resultPerPageSize =
    result.length >= pageSize ? result.slice(0, pageSize) : result;
  clb(resultPerPageSize, Math.ceil(result.length / pageSize));
};

export const findSearchedBooksProjected = async (
  name: string,
): Promise<Book[]> => {
  return bookService.findBySearchToken(name, {
    projection: {_id: 1, name: 1},
  });
};

export const findSearchedBooksByPage = async (
  name: string,
  page: number,
  pageSize: number,
): Promise<Book[]> => {
  return bookService.findBySearchToken(
    name,
    undefined,
    page * pageSize,
    pageSize,
  );
};

export const findFavouriteBooks = async (favs: string[]): Promise<Book[]> => {
  const inFavs: inOp = {$in: favs};
  console.log(favs);
  const books = await bookService.findAllByIds(inFavs);
  return books;
};

export type cartCallback = (modifiedCart: Cart[]) => void;
type favCallback = (modifiedFavs: string[], isAdded: boolean) => void;

export const findBook = (id: string): Promise<Book> =>
  bookService.findOne('_id', id);

export const requestBook = async (id: string): Promise<void> => {
  const br: request = {
    email: global.user.email,
    date: new Date(),
  };
  bookService.updateRequest(id, br);
};

/**
 * @param result - first page books
 * @param totalPagesNumber - the number of search books divided by items per page
 */
type searchResultCallback = (result: Book[], totalPagesNumber: number) => void;

const findCartBookNames = async (cart: Cart[]): Promise<string[]> => {
  const bookIds = cart.map((car) => car.bookId);
  const books: Book[] = await bookService.findAllByIds({$in: bookIds});
  return books.map((b) => b.name);
};
