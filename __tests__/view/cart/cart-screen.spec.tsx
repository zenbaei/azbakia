import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {Book} from '../../../src/domain/book/book';
import {Cart} from '../../../src/domain/user/user';
import MockedNavigator from '../../stubs/mocked-navigator';
import {CartScreen} from '../../../src/view/cart/cart-screen';
import * as actions from '../../../src/view/cart/cart-screen-actions';
import {CartBookVO} from '../../../src/view/cart/cart-book-vo';

const cart: Cart[] = [{bookId: '1', nuOfCopies: 1}] as Cart[];
const book: Book = {_id: '1', availableCopies: 3} as Book;

jest
  .spyOn(actions, 'loadCartBooksVOs')
  .mockResolvedValue([
    {_id: '1', availableCopies: 3, nuOfCopies: 1},
  ] as CartBookVO[]);

test(`Giving a book is added to cart,
    When displaying cart screen,
    Then it should display a drop-down with the available book's copies`, async () => {
  const {getAllByTestId} = render(<MockedNavigator screen1={CartScreen} />);
  expect.assertions(2);
  await waitFor(async () => {
    const names = getAllByTestId('names');
    const copies = getAllByTestId('copies');
    expect(names.length).toEqual(1);
    expect(copies[0].props.value).toEqual(3);
  });
});
