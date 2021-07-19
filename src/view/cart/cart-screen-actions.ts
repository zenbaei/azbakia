import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {Cart, User} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {cartCallback} from 'view/book/book-screen-actions';

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
    const price = (car?.amount as number) * bk.price;
    return new CartBookVO(
      bk._id,
      bk.name,
      car?.amount as number,
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
export const updateAmount = async (
  book: Book,
  amount: number,
  clb: cartCallback,
) => {
  const invUpdated = await bookService.updateInventory(
    book._id,
    book.inventory - amount,
  );
  const user: User = await userService.findOne('_id', global.user._id);
  const cart: Cart[] = user.cart.map((crt) =>
    crt.bookId === book._id ? {bookId: book._id, amount: amount} : crt,
  );
  const cartUpdated = await userService.updateCart(user._id, cart);
  if (invUpdated && cartUpdated) {
    clb(cart);
  }
};

type labelValue = {label: string; value: string};
