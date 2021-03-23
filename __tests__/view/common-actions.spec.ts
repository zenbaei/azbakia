import {
  getIconColor,
  addOrRemove,
  incrementCart,
  decrementCart,
  addToCart,
  removeFromCart,
} from '../../src/view/common-actions';
import {Cart} from '../../src/domain/user/user';
import {userService} from '../../src/domain/user/user-service';
import {bookService} from '../../src/domain/book/book-service';
import {Book} from '../../src/domain/book/book';
import {modificationResult} from 'zenbaei-js-lib/types';

const theme = require('zenbaei-js-lib/theme/app-theme');
const arr: string[] = ['islam', 'ali', 'hassan'];
let global: any;
global.user = {_id: 1};

jest
  .spyOn(theme, 'getAppTheme')
  .mockReturnValue({primary: 'white', secondary: 'black'});

test(`Giving array string is provided, When the first argument 
    exits in the array, Then it should return primary color`, () => {
  expect.assertions(1);
  const result = getIconColor('ali', arr);
  expect(result).toBe('white');
});

test(`Giving array string is provided, When the first argument is 
    not in the array, Then it should return secondary color`, () => {
  expect.assertions(1);
  const result = getIconColor('karim', arr);
  expect(result).toBe('black');
});

test(`Giving service is mocked and array is provided, When passed argument exists in array, 
  Then it should remove it from the array`, () => {
  expect.assertions(1);
  const result = addOrRemove('ali', arr);
  const modifiedArr = ['islam', 'hassan'];
  expect(result).toEqual(modifiedArr);
});

test(`Giving service is mocked and array is provided, When first argument doest not exist in array, 
  Then it should add it to the array`, () => {
  expect.assertions(1);
  const result = addOrRemove('mostafa', arr);
  expect(result).toEqual(arr.concat(['mostafa']));
});

test(`Giving cart array is provided, When the item doesn't exist,
  Then it should add it with nuOfCopies equal to 1`, () => {
  const cart = [];
  const result = incrementCart('test', cart);
  expect.assertions(1);
  expect(result).toEqual([{bookName: 'test', nuOfCopies: 1}]);
});

test(`Giving cart array is provided, When the item already exist,
  Then it should increment nuOfCopies by 1`, () => {
  const cart: Cart[] = [
    {bookName: 'b1', nuOfCopies: 1},
    {bookName: 'b2', nuOfCopies: 1},
  ] as Cart[];
  const result = incrementCart('b2', cart);
  expect.assertions(2);
  expect(result.length).toBe(2);
  expect(result[1]).toEqual({bookName: 'b2', nuOfCopies: 2});
});

test(`Giving cart array is provided, When the item already exist with a nuOfCopies higher than 1,
  Then it should decrement nuOfCopies by 1`, () => {
  const cart: Cart[] = [
    {bookName: 'b1', nuOfCopies: 1},
    {bookName: 'b2', nuOfCopies: 2},
  ] as Cart[];
  const result = decrementCart('b2', cart);
  expect.assertions(2);
  expect(result.length).toBe(2);
  expect(result[1]).toEqual({bookName: 'b2', nuOfCopies: 1});
});

test(`Giving cart array is provided, When the item already exist with a nuOfCopies equal to 1,
  Then it should remove the item from the cart`, () => {
  const cart: Cart[] = [
    {bookName: 'b1', nuOfCopies: 1},
    {bookName: 'b2', nuOfCopies: 2},
  ] as Cart[];
  const result = decrementCart('b1', cart);
  expect.assertions(2);
  expect(result.length).toBe(1);
  expect(result[0]).toEqual({bookName: 'b2', nuOfCopies: 2});
});

test(`Given cart array is provided, When adding to cart, 
  Then it should add to user's cart and substract from book copies`, async () => {
  const modified: modificationResult = {modified: 1};
  const userServiceSpy = jest
    .spyOn(userService, 'updateCart')
    .mockResolvedValue(modified);
  const bookServiceSpy = jest
    .spyOn(bookService, 'updateNuOfCopies')
    .mockResolvedValue(modified);
  const cart: Cart[] = [{bookName: 'b1', nuOfCopies: 2}];
  const book: Book = {_id: '100', name: 'b1', nuOfCopies: 1} as Book;
  expect.assertions(3);
  const result: boolean = await addToCart(book, cart);
  expect(userServiceSpy).toBeCalledTimes(1);
  expect(bookServiceSpy).toBeCalledWith(book._id, 0);
  expect(result).toBe(true);
  userServiceSpy.mockClear();
  bookServiceSpy.mockClear();
});

test(`Given cart array is provided, When removing from cart, 
  Then it should substract or remove from user's cart 
  and add to book copies`, async () => {
  const modified: modificationResult = {modified: 1};
  const userServiceSpy = jest
    .spyOn(userService, 'updateCart')
    .mockResolvedValue(modified);
  const bookServiceSpy = jest
    .spyOn(bookService, 'updateNuOfCopies')
    .mockResolvedValue(modified);
  const cart: Cart[] = [{bookName: 'b1', nuOfCopies: 2}];
  const book: Book = {_id: '100', name: 'b1', nuOfCopies: 1} as Book;
  expect.assertions(3);
  const result: boolean = await removeFromCart(book, cart);
  expect(userServiceSpy).toBeCalledTimes(1);
  expect(bookServiceSpy).toBeCalledWith(book._id, 2);
  expect(result).toBe(true);
  userServiceSpy.mockClear();
  bookServiceSpy.mockClear();
});
