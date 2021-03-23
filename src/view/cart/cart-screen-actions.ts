import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import {Cart} from 'domain/user/user';
import {cartCallback, _updateCart} from 'view/book/book-screen-actions';
import {CartBookVO} from './cart-book-vo';

export const _decrementCart = (bookId: string, cart: Cart[]): Cart[] => {
  let cartClone = [...cart];
  const index: number = cart.findIndex((val) => val.bookId === bookId);
  if (index >= 0 && cartClone[index].nuOfCopies > 1) {
    cartClone[index].nuOfCopies = cartClone[index].nuOfCopies - 1;
  } else if (index >= 0 && cartClone[index].nuOfCopies === 1) {
    cartClone.splice(index, 1);
  }
  return cartClone;
};

export const removeFromCart = async (
  bookId: string,
  availableCopies: number,
  cart: Cart[],
  callback: cartCallback,
): Promise<void> => {
  const modifiedCart = _decrementCart(bookId, cart);
  const isUpdated = _updateCart(bookId, availableCopies, modifiedCart, 1);
  if (isUpdated) {
    callback(modifiedCart);
  }
};

export const calculateSum = (cartBooksVO: CartBookVO[]): number => {
  return cartBooksVO
    .map((cartBk) => cartBk.price)
    .reduce((total, cur) => (total + cur) as number, 0);
};

export const loadCartBooksVOs = async (cart: Cart[]): Promise<CartBookVO[]> => {
  const bookIds = cart.map((car) => car.bookId);
  const books: Book[] = await bookService.findAllById({$in: bookIds});
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
