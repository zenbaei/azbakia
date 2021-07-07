import {AppThemeInterface} from 'zenbaei-js-lib/constants';
import {modificationResult} from 'zenbaei-js-lib/types';
import {Book} from '../../../src/domain/book/book';
import {bookService} from '../../../src/domain/book/book-service';
import {userService} from '../../../src/domain/user/user-service';
import {Cart} from '../../../src/domain/user/user';
import * as actions from '../../../src/view/book/book-screen-actions';

const arr: string[] = ['islam', 'ali', 'hassan'];
let global: any;
global.user = {_id: 1};

const theme: AppThemeInterface = {
  primary: 'white',
  secondary: 'black',
} as AppThemeInterface;

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
  const result = actions._addOrRemoveFromArr('ali', arr);
  const modifiedArr = ['islam', 'hassan'];
  expect(result).toEqual(modifiedArr);
});

test(`Giving service is mocked and array is provided, When first argument doest not exist in array, 
  Then it should add it to the array`, () => {
  expect.assertions(1);
  const result = actions._addOrRemoveFromArr('mostafa', arr);
  expect(result).toEqual(arr.concat(['mostafa']));
});

test(`Giving cart array is provided, When the item doesn't exist,
  Then it should add it with nuOfCopies equal to 1`, () => {
  const cart = [];
  const result = actions._incrementCart('test', cart);
  expect.assertions(1);
  expect(result).toEqual([{bookName: 'test', nuOfCopies: 1}]);
});

test(`Giving cart array is provided, When the item already exist,
  Then it should increment nuOfCopies by 1`, () => {
  const cart: Cart[] = [
    {bookId: 'b1', nuOfCopies: 1},
    {bookId: 'b2', nuOfCopies: 1},
  ] as Cart[];
  const result = actions._incrementCart('b2', cart);
  expect.assertions(2);
  expect(result.length).toBe(2);
  expect(result[1]).toEqual({bookName: 'b2', nuOfCopies: 2});
});

test(`Given cart array is provided, When adding to cart, 
  Then it should add to user's cart and substract from book copies`, async () => {
  const modified: modificationResult = {modified: 1};
  const userServiceSpy = jest
    .spyOn(userService, 'updateCart')
    .mockResolvedValue(modified);
  const bookServiceSpy = jest
    .spyOn(bookService, 'updateAvailableCopies')
    .mockResolvedValue(modified);
  const cart: Cart[] = [{bookId: 'b1', nuOfCopies: 2}];
  const book: Book = {_id: '100', name: 'b1', availableCopies: 1} as Book;
  expect.assertions(3);
  await actions.addToCart(book, cart, (newCart) =>
    expect(newCart).toBeTruthy(),
  );
  expect(userServiceSpy).toBeCalledTimes(1);
  expect(bookServiceSpy).toBeCalledWith(book._id, 0);
});
