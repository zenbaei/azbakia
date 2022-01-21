import {Product, request} from 'domain/product/product';
import {productService} from 'domain/product/product-service';
import {Cart} from 'domain/user/cart';
import {userService} from 'domain/user/user-service';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {modificationResult} from 'zenbaei-js-lib/types';
import {sort} from 'zenbaei-js-lib/utils';

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
  const cr = cart.find((c) => c.productId === bookId);
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
  product: Product,
  cart: Cart[],
): {modifiedCart: Cart[]; cartQuantity: number} => {
  let quantity: number = -1;
  let cartClone = [...cart];
  const index: number = cart.findIndex((val) => val.productId === product._id);
  if (index === -1) {
    cartClone.push({productId: product._id, quantity: 1, date: new Date()});
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
  book: Product,
  quantity: number,
): Promise<boolean> => {
  const result: modificationResult = await productService.updateInventory(
    book._id,
    book.inventory + quantity,
  );
  return result.modified === 1;
};

export const addOrRmvFrmCart = async (
  book: Product,
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
export const findProductsByPage = async (
  cart: Cart[],
  genre: string,
  page: number,
  pageSize: number,
): Promise<Product[]> => {
  const bookNames = await findCartProductNames(cart);
  return isEmpty(genre)
    ? productService.findByNewArrivals(bookNames, page * pageSize, pageSize)
    : productService.findByGenre(bookNames, genre, page * pageSize, pageSize);
};
*/

/**
 * Finds books by genre or newArrivals and return items for 1st page.

export const find1stProductsPageAndPageSize = async (
  cart: Cart[],
  genre: string,
  pageSize: number,
  clb: searchResultCallback,
): Promise<void> => {
  const bookNames = await findCartProductNames(cart);
  const result = isEmpty(genre)
    ? await productService.findByNewArrivals(bookNames)
    : await productService.findByGenre(bookNames, genre);
  let firstPageBooks =
    result.length >= pageSize ? result.slice(0, pageSize) : result;
  clb(firstPageBooks, Math.ceil(result.length / pageSize));
};
*/

export const find1stProductsPageAndPagingNumber = async (
  genre: string,
  pageSize: number,
  clb: searchResultCallback,
): Promise<void> => {
  const result = await productService.findByGenre(genre);
  let firstPageBooks =
    result.length >= pageSize ? result.slice(0, pageSize) : result;
  clb(firstPageBooks, Math.ceil(result.length / pageSize));
};

/**
 * Finds books by search token and return items for 1st page.
 * @param searchToken
 * @param clb
 */
export const find1stSearchedProductsPageAndPageSize = async (
  searchToken: string,
  pageSize: number,
  clb: searchResultCallback,
): Promise<void> => {
  const result = await productService.findBySearchToken(searchToken);
  let resultPerPageSize =
    result.length >= pageSize ? result.slice(0, pageSize) : result;
  clb(resultPerPageSize, Math.ceil(result.length / pageSize));
};

export const findSearchedProductsProjected = async (
  name: string,
): Promise<Product[]> => {
  return productService.findBySearchToken(name, {
    projection: {_id: 1, name: 1},
  });
};

export const findSearchedProductsByPage = async (
  name: string,
  page: number,
  pageSize: number,
): Promise<Product[]> => {
  return productService.findBySearchToken(
    name,
    undefined,
    page * pageSize,
    pageSize,
  );
};

export type cartCallback = (modifiedCart: Cart[]) => void;
type favCallback = (modifiedFavs: string[], isAdded: boolean) => void;

export const findProduct = (id: string): Promise<Product> =>
  productService.findOne('_id', id);

export const requestProduct = async (id: string): Promise<void> => {
  const br: request = {
    email: global.user.email,
    date: new Date(),
  };
  productService.updateRequest(id, br);
};

export const getMainImageUrl = async (filesPath: {
  files: string[];
}): Promise<string> => {
  const {files} = sort(filesPath);
  return files[0];
};

/**
 * @param result - first page books
 * @param totalPagesNumber - the number of search books divided by items per page
 */
type searchResultCallback = (result: Product[], pagingNumber: number) => void;

/*
const findCartProductNames = async (cart: Cart[]): Promise<string[]> => {
  const productsIds = cart.map((car) => car.productId);
  const products: Product[] = await productService.findAllByProductIds(
    productsIds,
  );
  return products.map((b) => b.name);
};
*/
