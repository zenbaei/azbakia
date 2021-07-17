import {Book} from '../../../src/domain/book/book';
import {bookService} from '../../../src/domain/book/book-service';
import {Cart, User} from '../../../src/domain/user/user';
import {userService} from '../../../src/domain/user/user-service';
import * as actions from '../../../src/view/cart/cart-screen-actions';

const cart: Cart[] = [
  {bookId: '1', requestedCopies: 1},
  {bookId: '2', requestedCopies: 2},
];

const book = {_id: '1', inventory: 2} as Book;

jest.spyOn(bookService, 'findOne').mockResolvedValue(book);
jest
  .spyOn(userService, 'findOne')
  .mockResolvedValue({_id: '11', cart: cart} as User);

const updateCartSpy = jest
  .spyOn(userService, 'updateCart')
  .mockResolvedValue({modified: 1});

const updateAvailableCopiesSpy = jest
  .spyOn(bookService, 'updateInventory')
  .mockResolvedValue({modified: 1});

test.todo('test summing books price');

test(`Given we need to turn a number into an array of that number length,
    When the number is 3,
    Then it should return an array of length 4 from 0 to 3`, () => {
  expect.assertions(2);
  const expectedResult = [
    {label: '0', value: '0'},
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
  ];
  const result = actions.flatenNumberToArray(3);
  expect(result.length).toBe(4);
  expect(result).toEqual(expectedResult);
});

test(`Given book's available copies data is stale,
    When copies are less than request cart copies,
    Then it should return false`, async () => {
  expect.assertions(1);
  const result = await actions.updateRequestedCopies('1', 3);
  expect(result).toBeFalsy();
});

test(`Given book's available copies data is stale,
    When copies are larger or equal to requested cart copies,
    Then it should return true`, async () => {
  expect.assertions(1);
  const result = await actions.updateRequestedCopies('1', 2);
  expect(result).toBeTruthy();
});

test(`Given a request for more copies happened from a client on cart screen,
    When updating the book's available copies,
    Then it should substract the new requested copies from the available one`, async () => {
  expect.assertions(1);
  await actions.updateRequestedCopies('1', 1);
  expect(updateAvailableCopiesSpy).toBeCalledWith('1', 1);
});

test(`Given a request for more copies happened from a client on cart screen,
    When updating user's cart,
    Then it should update the exact book with the request copies
    while leaving the other books in cart untouched`, async () => {
  expect.assertions(1);
  await actions.updateRequestedCopies('1', 2);
  const newCart: Cart[] = [{bookId: '1', requestedCopies: 2}, cart[1]];
  expect(updateCartSpy).toBeCalledWith('11', newCart);
});

//test(`Given `);
