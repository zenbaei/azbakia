import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {Cart} from 'domain/user/user';
import {userService} from 'domain/user/user-service';
import {cartCallback} from 'view/book/book-screen-actions';
import {_pushOrPopCart} from '../book/book-screen-actions';
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
    const crt = cart.find((val) => val.bookId === bk._id);
    const price = crt ? crt.amount * bk.price : bk.price;
    return new CartBookVO(
      bk._id,
      bk.name,
      crt ? crt.amount : 1,
      price,
      bk.imageFolderName,
      bk.inventory,
    );
  });
};

export const flatenNumberToArray = (val: number): labelValue[] => {
  const arr: labelValue[] = [];
  for (let i = 1; i <= val; i++) {
    arr.push({label: String(i), value: String(i)});
  }
  return arr;
};

export const updateAmount = async (
  book: Book,
  cart: Cart[],
  oldAmount: number,
  newAmount: number,
  clb: cartCallback,
) => {
  const invUpdated = await bookService.updateInventory(
    book._id,
    book.inventory + oldAmount - newAmount,
  );
  const modifiedCart: Cart[] = cart.map((crt) =>
    crt.bookId === book._id ? {bookId: book._id, amount: newAmount} : crt,
  );
  const cartUpdated = await userService.updateCart(
    global.user._id,
    modifiedCart,
  );
  if (invUpdated && cartUpdated) {
    clb(modifiedCart);
  }
};

export const removeFromCart = async (
  bookId: string,
  cart: Cart[],
  clb: cartCallback,
) => {
  const book = await bookService.findOne('_id', bookId);
  const cartBk = cart.find((crt) => crt.bookId === bookId);
  const invUpdated = await bookService.updateInventory(
    bookId,
    book.inventory + (cartBk ? cartBk.amount : 0),
  );
  const modifiedCart = _pushOrPopCart(bookId, cart);
  const cartUpdated = await userService.updateCart(
    global.user._id,
    modifiedCart,
  );
  if (invUpdated && cartUpdated) {
    clb(modifiedCart);
  }
};

type labelValue = {label: string; value: string};
