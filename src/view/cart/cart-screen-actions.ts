import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {Cart} from 'domain/user/user';

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
    const price = (car?.nuOfCopies as number) * bk.price;
    return new CartBookVO(
      bk._id,
      bk.name,
      car?.nuOfCopies as number,
      price,
      bk.imageFolderName,
      bk.availableCopies,
    );
  });
};
