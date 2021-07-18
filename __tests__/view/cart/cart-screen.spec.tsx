import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import MockedNavigator from '../../stubs/mocked-navigator';
import {CartScreen} from '../../../src/view/cart/cart-screen';
import * as actions from '../../../src/view/cart/cart-screen-actions';
import {CartBookVO} from '../../../src/view/cart/cart-book-vo';
import {Picker} from 'zenbaei-js-lib/react';
import * as bookScreenActions from '../../../src/view/book/book-screen-actions';
import {bookService} from '../../../src/domain/book/book-service';
import {Book} from '../../../src/domain/book/book';

jest
  .spyOn(actions, 'loadCartBooksVOs')
  .mockResolvedValue([
    {_id: '1', inventory: 3, requestedCopies: 1},
  ] as CartBookVO[]);

const addOrRmvFrmCartSpy = jest
  .spyOn(bookScreenActions, 'addOrRmvFrmCart')
  .mockResolvedValue();

jest
  .spyOn(bookService, 'findOne')
  .mockResolvedValue({_id: '1', inventory: 3} as Book);

const updateRequestedCopiesSpy = jest.spyOn(actions, 'updateRequestedCopies');

test(`Giving a book is added to cart,
    When displaying cart screen,
    Then it should display a drop-down with the book's inventory`, async () => {
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.data.length).toEqual(4);
    expect(dropDown[0].props.data[3].value).toEqual('3');
  });
});

test(`Giving a book is added to cart,
    When displaying the requested book copies,
    Then it should select the requested copies number from the drop-down list`, async () => {
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} />,
  );
  expect.assertions(1);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.selectedValue).toEqual('1');
  });
});

test(`Giving a book is added to cart,
    When changing the requested book copies to zero,
    Then it should remove the book from the cart`, async () => {
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    await fireEvent(dropDown[0], 'onValueChange', '0');
    expect(addOrRmvFrmCartSpy).toBeCalledWith(
      expect.anything(),
      [],
      -1,
      expect.anything(),
    );
    expect(updateRequestedCopiesSpy).not.toBeCalled();
  });
});
