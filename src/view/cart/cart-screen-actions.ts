import {Product} from 'domain/product/product';
import {productService} from 'domain/product/product-service';
import {Cart} from 'domain/user/cart';
import {userService} from 'domain/user/user-service';
import {cartCallback} from 'view/product/product-screen-actions';
import {_pushOrPopCart} from '../product/product-screen-actions';
import {CartProductVO as CartProductVO} from './cart-product-vo';

export const calculateSum = (cartBooksVO: CartProductVO[]): number => {
  return cartBooksVO
    .map((cartBk) => cartBk.price * cartBk.quantity)
    .reduce((total, cur) => (total + cur) as number, 0);
};

export const loadCartProductsVOs = async (
  cart: Cart[],
): Promise<CartProductVO[]> => {
  const bookIds = cart.map((car) => car.productId);
  const books: Product[] = await productService.findAllByProductIds(bookIds);
  return books.map((bk) => {
    const crt = cart.find((val) => val.productId === bk._id);
    return new CartProductVO(
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
  product: Product,
  cart: Cart[],
  oldQuantity: number,
  newQuantity: number,
  clb: cartCallback,
) => {
  const invUpdated = await productService.updateInventory(
    product._id,
    product.inventory + oldQuantity - newQuantity,
  );
  const modifiedCart: Cart[] = cart.map((crt) =>
    crt.productId === product._id
      ? {productId: product._id, quantity: newQuantity, date: new Date()}
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
  productId: string,
  cart: Cart[],
  clb: cartCallback,
) => {
  const product = await productService.findOne('_id', productId);
  const cartPd = cart.find((crt) => crt.productId === productId);
  const invUpdated = await productService.updateInventory(
    productId,
    product.inventory + (cartPd ? cartPd.quantity : 0),
  );
  const {modifiedCart} = _pushOrPopCart(product, cart);
  const cartUpdated = await userService.updateCart(
    global.user._id,
    modifiedCart,
  );
  if (invUpdated && cartUpdated) {
    clb(modifiedCart);
  }
};

type labelValue = {label: string; value: string};
