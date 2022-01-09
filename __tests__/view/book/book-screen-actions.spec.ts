import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {Book} from '../../../src/domain/book/book';
import {bookService} from '../../../src/domain/book/book-service';
import {userService} from '../../../src/domain/user/user-service';
import {Cart} from '../../../src/domain/user/user';
import * as actions from '../../../src/view/product/product-screen-actions';

const arr: string[] = ['islam', 'ali', 'hassan'];
let global: any;

const updateCartSpy = jest
  .spyOn(userService, 'updateCart')
  .mockResolvedValue({modified: 1});

const theme: AppThemeInterface = {
  primary: 'white',
  secondary: 'black',
} as AppThemeInterface;

const updateInventorySpy = jest
  .spyOn(bookService, 'updateInventory')
  .mockResolvedValue({modified: 1});

beforeEach(() => {
  updateCartSpy.mockClear();
  updateInventorySpy.mockClear();
});

test(`Giving a string array has an item, When checking that item in this array,
    Then it should return secondary color`, () => {
  expect.assertions(1);
  const result = actions.getIconColor('ali', arr, theme);
  expect(result).toBe(theme.secondary);
});

test(`Giving array string is provided, When the first argument is 
    not in the array, Then it should return primary color`, () => {
  expect.assertions(1);
  const result = actions.getIconColor('karim', arr, theme);
  expect(result).toBe(theme.primary);
});

test(`Giving service is mocked and array is provided, When passed argument exists in array, 
  Then it should remove it from the array`, () => {
  expect.assertions(1);
  const result = actions._pushOrPop('ali', arr);
  const modifiedArr = ['islam', 'hassan'];
  expect(result).toEqual(modifiedArr);
});

test(`Giving service is mocked and array is provided, When first argument doest not exist in array, 
  Then it should add it to the array`, () => {
  expect.assertions(1);
  const result = actions._pushOrPop('mostafa', arr);
  expect(result).toEqual(arr.concat(['mostafa']));
});

test(`Giving cart array is provided, When the item doesn't exist,
  Then it should add it with nuOfCopies equal to 1`, () => {
  const cart = [];
  expect.assertions(1);
  const {modifiedCart} = actions._pushOrPopCart('test', cart);
  expect(modifiedCart).toEqual([{bookId: 'test', amount: 1} as Cart]);
});

test(`Given cart array is provided, When adding to cart, 
  Then it should add to user's cart and substract from book copies`, async () => {
  const cart: Cart[] = [{bookId: 'b1'} as Cart];
  const book: Book = {_id: '100', name: 'bkname', inventory: 1} as Book;
  expect.assertions(3);
  await actions.addOrRmvFrmCart(book, cart, (newCart) => {
    expect(newCart).toBeTruthy();
  });
  expect(updateCartSpy).toBeCalledWith(global.user._id, [
    {bookId: 'b1'},
    {bookId: '100', amount: 1},
  ]);
  expect(updateInventorySpy).toBeCalledWith(book._id, 0);
});

test(`Giving cart had a book, When calling pushOrPop with same item,
  Then it should remove the item from the array`, () => {
  const cart: Cart[] = [
    {bookId: 'b1', amount: 1},
    {bookId: 'b2', amount: 2},
  ] as Cart[];
  expect.assertions(2);
  const {modifiedCart} = actions._pushOrPopCart('b2', cart);
  expect(modifiedCart.length).toBe(1);
  expect(modifiedCart[0]).toEqual({bookId: 'b1', amount: 1} as Cart);
});

test(`Given cart array is provided, When removing from cart, 
  Then it should remove the item from user's cart 
  and add to book copies`, async () => {
  const cart: Cart[] = [{bookId: 'b1', amount: 2}];
  const book: Book = {_id: 'b1', inventory: 1} as Book;
  expect.assertions(3);
  await actions.addOrRmvFrmCart(book, cart, (cartItems) => {
    expect(cartItems.length).toBe(0);
  });
  expect(updateCartSpy).toBeCalledTimes(1);
  expect(updateInventorySpy).toBeCalledWith(book._id, 3);
});

test(`Given a find result is provided less than the page size, When calculating the max page number,
  Then it should be one`, async () => {
  expect.assertions(1);
  jest
    .spyOn(bookService, 'findByNewArrivals')
    .mockResolvedValue([{_id: '1'}, {_id: '2'}] as Book[]);
  await actions.loadFirstBooksPageAndCalcTotalPagesNumber(
    undefined,
    (result, pageNum) => {
      expect(pageNum).toBe(1);
    },
  );
});

test(`Given a find result is provided greater than the page size, When calculating the max page number,
  Then it should be 2`, async () => {
  expect.assertions(1);
  jest
    .spyOn(bookService, 'findByNewArrivals')
    .mockResolvedValue([{_id: '1'}, {_id: '2'}, {}, {}, {}, {}, {}] as Book[]);
  await actions.loadFirstBooksPageAndCalcTotalPagesNumber(
    undefined,
    (result, pageNum) => {
      expect(pageNum).toBe(2);
    },
  );
});

test(`Given a cart had 2 copies of a book, 
  When removing this book from cart,
  Then it should update the book inventory by adding 2 copies`, async () => {
  const bk: Book = {_id: '1', inventory: 0} as Book;
  const cart: Cart = {bookId: '1', amount: 2} as Cart;
  await actions.addOrRmvFrmCart(bk, [cart], () => {});
  expect.assertions(1);
  expect(updateInventorySpy).toBeCalledWith('1', 2);
});
