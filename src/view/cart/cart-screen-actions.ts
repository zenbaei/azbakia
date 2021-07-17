import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {Cart, User} from 'domain/user/user';
import {userService} from 'domain/user/user-service';

import {CartBookVO} from './cart-book-vo';

export const calculateSum = (cartBooksVO: CartBookVO[]): number => {
  return cartBooksVO
    .map((cartBk) => cartBk.price)
    .reduce((total, cur) => (total + cur) as number, 0);
};

export const loadCartBooksVOs = async (cart: Cart[]): Promise<CartBookVO[]> => {
  const bookIds = cart.map((car) => car.bookId);
  const books: Book[] = await bookService.findAllByIds({$in: bookIds});
  return books.map((bk) => {
    const car = cart.find((val) => val.bookId === bk._id);
    const price = (car?.requestedCopies as number) * bk.price;
    return new CartBookVO(
      bk._id,
      bk.name,
      car?.requestedCopies as number,
      price,
      bk.imageFolderName,
      bk.inventory,
    );
  });
};

export const flatenNumberToArray = (val: number): labelValue[] => {
  const arr: labelValue[] = [];
  for (let i = 0; i <= val; i++) {
    arr.push({label: String(i), value: String(i)});
  }
  return arr;
};

/**
 *
 * @returns false if book available copies data is stale and are less than
 * the requested cart copies.
 */
export const updateRequestedCopies = async (
  bookId: string,
  requestedCopies: number,
): Promise<boolean> => {
  const book = await bookService.findOne('_id', bookId);
  if (book.inventory < requestedCopies) {
    return false;
  }
  bookService.updateInventory(bookId, book.inventory - requestedCopies);
  const user: User = await userService.findOne('_id', global.user._id);
  const cart: Cart[] = user.cart.map((crt) =>
    crt.bookId === bookId
      ? {bookId: bookId, requestedCopies: requestedCopies}
      : crt,
  );
  const isUpdated = userService.updateCart(user._id, cart);
  return true;
};

type labelValue = {label: string; value: string};
