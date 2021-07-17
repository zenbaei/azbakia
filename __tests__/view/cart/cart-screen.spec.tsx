import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {Book} from '../../../src/domain/book/book';
import {Cart} from '../../../src/domain/user/user';
import MockedNavigator from '../../stubs/mocked-navigator';
import {CartScreen} from '../../../src/view/cart/cart-screen';
import * as actions from '../../../src/view/cart/cart-screen-actions';
import {CartBookVO} from '../../../src/view/cart/cart-book-vo';
import {Picker} from 'zenbaei-js-lib/react';

const cart: Cart[] = [{bookId: '1', requestedCopies: 1}] as Cart[];
const book: Book = {_id: '1', inventory: 3} as Book;

jest
  .spyOn(actions, 'loadCartBooksVOs')
  .mockResolvedValue([
    {_id: '1', inventory: 3, requestedCopies: 1},
  ] as CartBookVO[]);

test(`Giving a book is added to cart,
    When displaying cart screen,
    Then it should display a drop-down with the book's inventory`, async () => {
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown.length).toEqual(1);
    expect(dropDown[0].props.data[3].value).toEqual('3');
  });
});
