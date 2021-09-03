import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import MockedNavigator from '../../stubs/mocked-navigator';
import {CartScreen} from '../../../src/view/cart/cart-screen';
import * as actions from '../../../src/view/cart/cart-screen-actions';
import {CartBookVO} from '../../../src/view/cart/cart-book-vo';
import {Picker} from 'zenbaei-js-lib/react';
import {bookService} from '../../../src/domain/book/book-service';
import {userService} from '../../../src/domain/user/user-service';
import {Book} from '../../../src/domain/book/book';
import {Cart} from '../../../src/domain/user/user';
import {act} from 'react-test-renderer';
import IconButton from 'react-native-paper/src/components/IconButton';

const cart1: Cart = {bookId: '1', amount: 1};
const cart2: Cart = {bookId: '1', amount: 2};

beforeEach(() => {
  jest
    .spyOn(actions, 'loadCartBooksVOs')
    .mockResolvedValue([{_id: '1', inventory: 3, amount: 1}] as CartBookVO[]);
  jest
    .spyOn(bookService, 'findOne')
    .mockResolvedValue({_id: '1', inventory: 3} as Book);
});

const updateInventorySpy = jest
  .spyOn(bookService, 'updateInventory')
  .mockResolvedValue({modified: 1});

const updateCartSpy = jest
  .spyOn(userService, 'updateCart')
  .mockResolvedValue({modified: 1});

const removeFromCartSpy = jest.spyOn(actions, 'removeFromCart');

afterEach(() => {
  updateInventorySpy.mockClear();
  updateCartSpy.mockClear();
});

test(`Giving a book is added to cart,
    When displaying the cart's book amount,
    Then it should select this amount number from the drop-down list`, async () => {
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart1]} />,
  );
  expect.assertions(1);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.selectedValue).toEqual('1');
  });
});

test(`Given cart listed a book's inventory that will get exhausted after display,
  When the user tries to add more copies of this book,
  Then it should update the listed book inventory and show alert`, async () => {
  jest
    .spyOn(bookService, 'findOne')
    .mockImplementationOnce(() =>
      Promise.resolve({_id: '1', inventory: 0} as Book),
    );
  expect.assertions(2);
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} />,
  );
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.data.length).toBe(4);
    await fireEvent(dropDown[0], 'onValueChange', 2);
    expect(dropDown[0].props.data.length).toBe(1); // 0
  });
});

test(`Given book's inventory is 3 and Cart's amount is 1,
  When displayed for the user as a drop down to select the amount he wants from,
  Then the drop down should has 4 items starting with a value of 1 until 4;
  the sum of invetory and amount (1 in cart and 3 left)`, async () => {
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} />,
  );
  expect.assertions(3);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.data.length).toEqual(4);
    expect(dropDown[0].props.data[0].value).toEqual('1');
    expect(dropDown[0].props.data[3].value).toEqual('4');
  });
});

test(`Giving a book is added to cart and nothing left in inventory,
    When displaying book amount as a drop down,
    Then it should has only one item with a value of 1`, async () => {
  jest
    .spyOn(actions, 'loadCartBooksVOs')
    .mockImplementationOnce(() =>
      Promise.resolve([{_id: '1', inventory: 0, amount: 1}] as CartBookVO[]),
    );
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.data.length).toEqual(1);
    expect(dropDown[0].props.data[0].value).toEqual('1');
  });
});

test(`Given the invetory is 1 and the cart amount is 2,
  When user request the left copy from the inventory, 
  Then it should update the inventory with a value of 0 and the cart with 3`, async () => {
  jest
    .spyOn(actions, 'loadCartBooksVOs')
    .mockImplementationOnce(() =>
      Promise.resolve([{_id: '1', inventory: 1, amount: 2}] as CartBookVO[]),
    );

  jest
    .spyOn(bookService, 'findOne')
    .mockImplementationOnce(() =>
      Promise.resolve({_id: '1', inventory: 1} as Book),
    );

  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart2]} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    await fireEvent(dropDown[0], 'onValueChange', 3);
  });
  act(() => {
    expect(updateInventorySpy).toBeCalledWith('1', 0);
    expect(updateCartSpy).toBeCalledWith('1', [
      {bookId: '1', amount: 3},
    ] as Cart[]);
  });
});

test(`Given the invetory is 2 and the cart amount is 2,
  When user request the left copies from the inventory, 
  Then it should update the inventory with a value of 0 and the cart with 4`, async () => {
  jest
    .spyOn(actions, 'loadCartBooksVOs')
    .mockImplementationOnce(() =>
      Promise.resolve([{_id: '1', inventory: 2, amount: 2}] as CartBookVO[]),
    );

  jest
    .spyOn(bookService, 'findOne')
    .mockImplementationOnce(() =>
      Promise.resolve({_id: '1', inventory: 2} as Book),
    );

  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart2]} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    await fireEvent(dropDown[0], 'onValueChange', 4);
  });
  act(() => {
    expect(updateInventorySpy).toBeCalledWith('1', 0);
    expect(updateCartSpy).toBeCalledWith('1', [
      {bookId: '1', amount: 4},
    ] as Cart[]);
  });
});

test(`Given the invetory is 3 and the cart amount is 2,
  When user changes his cart from 2 to 1, 
  Then it should update the inventory with a value of 4 and the cart with 1`, async () => {
  jest
    .spyOn(actions, 'loadCartBooksVOs')
    .mockImplementationOnce(() =>
      Promise.resolve([{_id: '1', inventory: 3, amount: 2}] as CartBookVO[]),
    );

  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart2]} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    await fireEvent(dropDown[0], 'onValueChange', 1);
  });
  act(() => {
    expect(updateInventorySpy).toBeCalledWith('1', 4);
    expect(updateCartSpy).toBeCalledWith('1', [
      {bookId: '1', amount: 1},
    ] as Cart[]);
  });
});

test(`Given the invetory is 3 and the cart amount is 1,
  When the remove from cart button is pressed, 
  Then the inventory field should be updated with 4 and the cart should be removed`, async () => {
  const {UNSAFE_getByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart1]} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const btn = UNSAFE_getByType(IconButton);
    await fireEvent.press(btn);
  });
  act(() => {
    expect(updateInventorySpy).toBeCalledWith('1', 4);
    expect(updateCartSpy).toBeCalledWith('1', [] as Cart[]);
  });
});

test(`Given the invetory has as stale data of 3 while the actual is 1 and the cart amount is 1,
  When the user request another 2 copies, 
  Then no services should be called and the view should be updated to have only 2 in the drop down list`, async () => {
  let dropDown: any;
  jest
    .spyOn(bookService, 'findOne')
    .mockImplementationOnce(() =>
      Promise.resolve({_id: '1', inventory: 1} as Book),
    );
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart1]} />,
  );
  expect.assertions(4);
  await waitFor(async () => {
    dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.data.length).toBe(4);
    await fireEvent(dropDown[0], 'onValueChange', 3);
  });
  act(() => {
    expect(updateInventorySpy).not.toBeCalled();
    expect(dropDown[0].props.data.length).toBe(2);
    expect(dropDown[0].props.selectedValue).toBe('1');
  });
});

test(`Given the invetory has as stale data of 3 while the actual is 0 and the cart amount is 1,
  When the user press remove from cart button, 
  Then it should update the invetory to have 1 and remove from cart`, async () => {
  jest
    .spyOn(bookService, 'findOne')
    .mockImplementationOnce(() =>
      Promise.resolve({_id: '1', inventory: 0} as Book),
    );
  const {UNSAFE_getByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart1]} />,
  );
  expect.assertions(3);
  await waitFor(async () => {
    const btn = UNSAFE_getByType(IconButton);
    await fireEvent.press(btn);
    expect(removeFromCartSpy).toBeCalled();
  });
  act(() => {
    expect(updateInventorySpy).toBeCalledWith('1', 1);
    expect(updateCartSpy).toBeCalledWith('1', []);
  });
});

test(`Given the invetory has 0 copies and the cart amount is 1,
  When the cart is displayed, 
  Then it should has only 1 item in the drop down`, async () => {
  jest
    .spyOn(actions, 'loadCartBooksVOs')
    .mockImplementationOnce(() =>
      Promise.resolve([{_id: '1', inventory: 0, amount: 1}] as CartBookVO[]),
    );

  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={CartScreen} cart={[cart1]} />,
  );
  expect.assertions(2);
  await waitFor(async () => {
    const dropDown = UNSAFE_getAllByType(Picker);
    expect(dropDown[0].props.data.length).toBe(1);
    expect(dropDown[0].props.selectedValue).toBe('1');
  });
});

test.todo(
  `test changing amount relation with item price and total calculatino`,
);
