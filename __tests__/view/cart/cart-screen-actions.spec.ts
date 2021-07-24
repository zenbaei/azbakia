import {Book} from '../../../src/domain/book/book';
import {bookService} from '../../../src/domain/book/book-service';
import {Cart, User} from '../../../src/domain/user/user';
import {userService} from '../../../src/domain/user/user-service';
import * as actions from '../../../src/view/cart/cart-screen-actions';

const cart: Cart[] = [
  {bookId: '1', amount: 1},
  {bookId: '2', amount: 2},
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
