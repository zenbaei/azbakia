import {Product} from 'domain/product/product';
import {productService} from 'domain/product/product-service';
import {Cart} from 'domain/user/cart';
import {userService} from 'domain/user/user-service';
import {cartCallback} from 'view/product/product-screen-actions';
import {_pushOrPopCart} from '../product/product-screen-actions';
import {CartBookVO} from './cart-book-vo';

export const calculateSum = (cartBooksVO: CartBookVO[]): number => {
  return cartBooksVO
    .map((cartBk) => cartBk.price * cartBk.quantity)
    .reduce((total, cur) => (total + cur) as number, 0);
};

export const loadCartBooksVOs = async (cart: Cart[]): Promise<CartBookVO[]> => {
  const bookIds = cart.map((car) => car.productId);
  const books: Product[] = await productService.findAllByProductIds(bookIds);
  return books.map((bk) => {
    const crt = cart.find((val) => val.productId === bk._id);
    return new CartBookVO(
      bk._id,
      bk.name,
      crt?.quantity as number,
      bk.price,
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

export const updateQuantity = async (
  book: Product,
  cart: Cart[],
  oldQuantity: number,
  newQuantity: number,
  clb: cartCallback,
) => {
  const invUpdated = await productService.updateInventory(
    book._id,
    book.inventory + oldQuantity - newQuantity,
  );
  const modifiedCart: Cart[] = cart.map((crt) =>
    crt.productId === book._id
      ? {productId: book._id, quantity: newQuantity, bookName: book.name}
      : crt,
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
  const book = await productService.findOne('_id', bookId);
  const cartBk = cart.find((crt) => crt.productId === bookId);
  const invUpdated = await productService.updateInventory(
    bookId,
    book.inventory + (cartBk ? cartBk.quantity : 0),
  );
  const {modifiedCart} = _pushOrPopCart(book, cart);
  const cartUpdated = await userService.updateCart(
    global.user._id,
    modifiedCart,
  );
  if (invUpdated && cartUpdated) {
    clb(modifiedCart);
  }
};

type labelValue = {label: string; value: string};
