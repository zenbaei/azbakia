import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {modificationResult} from 'zenbaei-js-lib/types';
import {Book} from '../../../src/domain/book/book';
import {bookService} from '../../../src/domain/book/book-service';
import {userService} from '../../../src/domain/user/user-service';
import {Cart} from '../../../src/domain/user/user';
import * as actions from '../../../src/view/book/book-screen-actions';

const arr: string[] = ['islam', 'ali', 'hassan'];

const updateCartSpy = jest
  .spyOn(userService, 'updateCart')
  .mockResolvedValue({modified: 1});

const theme: AppThemeInterface = {
  primary: 'white',
  secondary: 'black',
} as AppThemeInterface;

beforeEach(() => updateCartSpy.mockClear());

test(`Giving array string is provided, When the first argument 
    exits in the array, Then it should return primary color`, () => {
  expect.assertions(1);
  const result = actions.getIconColor('ali', arr, theme);
  expect(result).toBe('white');
});

test(`Giving array string is provided, When the first argument is 
    not in the array, Then it should return secondary color`, () => {
  expect.assertions(1);
  const result = actions.getIconColor('karim', arr, theme);
  expect(result).toBe('black');
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
  const result = actions._pushOrPopCart('test', cart);
  expect.assertions(1);
  expect(result).toEqual([{bookId: 'test', requestedCopies: 1} as Cart]);
});

test(`Given cart array is provided, When adding to cart, 
  Then it should add to user's cart and substract from book copies`, async () => {
  const modified: modificationResult = {modified: 1};
  const updateAvlCopiesSpy = jest
    .spyOn(bookService, 'updateInventory')
    .mockResolvedValue(modified);
  const cart: Cart[] = [{bookId: 'b1', requestedCopies: 2}];
  const book: Book = {_id: '100', name: 'b1', inventory: 1} as Book;
  expect.assertions(3);
  await actions.addOrRmvFrmCart(book, cart, 1, (newCart) =>
    expect(newCart).toBeTruthy(),
  );
  expect(updateCartSpy).toBeCalledTimes(1);
  expect(updateAvlCopiesSpy).toBeCalledWith(book._id, 0);
});

test(`Giving cart array is provided, When the item already exist in cart and readded(remove button),
  Then it should remove the item from the array`, () => {
  const cart: Cart[] = [
    {bookId: 'b1', requestedCopies: 1},
    {bookId: 'b2', requestedCopies: 2},
  ] as Cart[];
  const result = actions._pushOrPopCart('b2', cart);
  expect.assertions(2);
  expect(result.length).toBe(1);
  expect(result[0]).toEqual({bookId: 'b1', requestedCopies: 1} as Cart);
});

test(`Given cart array is provided, When removing from cart, 
  Then it should remove the item from user's cart 
  and add to book copies`, async () => {
  const bookServiceSpy = jest
    .spyOn(bookService, 'updateInventory')
    .mockResolvedValue({modified: 1});
  const cart: Cart[] = [{bookId: 'b1', requestedCopies: 2}];
  const book: Book = {_id: 'b1', inventory: 1} as Book;
  expect.assertions(3);
  await actions.addOrRmvFrmCart(book, cart, -1, (cartItems) => {
    expect(cartItems.length).toBe(0);
  });
  expect(updateCartSpy).toBeCalledTimes(1);
  expect(bookServiceSpy).toBeCalledWith(book._id, 2);
});
