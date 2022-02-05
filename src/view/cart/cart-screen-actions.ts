import {Product} from 'domain/product/product';
import {productService} from 'domain/product/product-service';
import {Cart, CartProduct} from 'domain/user/cart';
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
  cartProducts: CartProduct[],
): Promise<CartProductVO[]> => {
  const productIds = cartProducts.map((car) => car.productId);
  const products: Product[] = await productService.findAllByProductIds(
    productIds,
  );
  return products.map((prd) => {
    const crt = cartProducts.find((val) => val.productId === prd._id);
    return new CartProductVO(
      prd._id,
      prd.name,
      crt?.quantity as number,
      prd.price,
      prd.inventory,
      prd.description,
      prd.language,
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
  cart: Cart,
  oldQuantity: number,
  newQuantity: number,
  clb: cartCallback,
) => {
  const invUpdated = await productService.updateInventory(
    product._id,
    product.inventory + oldQuantity - newQuantity,
  );
  const modifiedCart: CartProduct[] = cart.products.map((crt) =>
    crt.productId === product._id
      ? {productId: product._id, quantity: newQuantity}
      : crt,
  );
  const newCart = {date: cart.date, products: modifiedCart};
  const cartUpdated = await userService.updateCart(global.user._id, newCart);
  if (invUpdated && cartUpdated) {
    clb(newCart);
  }
};

export const removeFromCart = async (
  productId: string,
  cart: Cart,
  clb: cartCallback,
) => {
  const product = await productService.findOne('_id', productId);
  const cartPd = cart.products.find((crt) => crt.productId === productId);
  const invUpdated = await productService.updateInventory(
    productId,
    product.inventory + (cartPd ? cartPd.quantity : 0),
  );
  const {modifiedCart} = _pushOrPopCart(product, cart.products);
  cart.products = modifiedCart;
  const cartUpdated = await userService.updateCart(global.user._id, cart);
  if (invUpdated && cartUpdated) {
    clb(cart);
  }
};

type labelValue = {label: string; value: string};
