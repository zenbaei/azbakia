import {modificationResult} from 'zenbaei-js-lib/types';
import {Book} from '../../../src/domain/book/book';
import {bookService} from '../../../src/domain/book/book-service';
import {Cart} from '../../../src/domain/user/user';
import {userService} from '../../../src/domain/user/user-service';
import * as actions from '../../../src/view/cart/cart-screen-actions';

test(`Giving cart array is provided, When the item already exist with a nuOfCopies higher than 1,
  Then it should decrement nuOfCopies by 1`, () => {
  const cart: Cart[] = [
    {bookId: 'b1', nuOfCopies: 1},
    {bookId: 'b2', nuOfCopies: 2},
  ] as Cart[];
  const result = actions._decrementCart('b2', cart);
  expect.assertions(2);
  expect(result.length).toBe(2);
  expect(result[1]).toEqual({bookName: 'b2', nuOfCopies: 1});
});

test(`Giving cart array is provided, When the item already exist with a nuOfCopies equal to 1,
  Then it should remove the item from the cart`, () => {
  const cart: Cart[] = [
    {bookId: 'b1', nuOfCopies: 1},
    {bookId: 'b2', nuOfCopies: 2},
  ] as Cart[];
  const result = actions._decrementCart('b1', cart);
  expect.assertions(2);
  expect(result.length).toBe(1);
  expect(result[0]).toEqual({bookName: 'b2', nuOfCopies: 2});
});

test(`Given cart array is provided, When removing from cart, 
  Then it should substract or remove from user's cart 
  and add to book copies`, async () => {
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
  const result: boolean = await actions.removeFromCart(book, cart);
  expect(userServiceSpy).toBeCalledTimes(1);
  expect(bookServiceSpy).toBeCalledWith(book._id, 2);
  expect(result).toBe(true);
});
