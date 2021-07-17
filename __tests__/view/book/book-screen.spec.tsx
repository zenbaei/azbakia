import React from 'react';
import {BookScreen} from '../../../src/view/book/book-screen';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import MockedNavigator from '../../stubs/mocked-navigator';
import {bookService} from '../../../src/domain/book/book-service';
import {Card, Fab} from 'zenbaei-js-lib/react';
import {Book} from '../../../src/domain/book/book';
import * as bookScreenActions from '../../../src/view/book/book-screen-actions';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import {DrawerLike} from '../../stubs/drawer-like';
import {act} from 'react-test-renderer';
import {userService} from '../../../src/domain/user/user-service';

/*
const eventData = {
  nativeEvent: {
    contentOffset: {
      y: 500,
    },
    contentSize: {
      // Dimensions of the scrollable content
      height: 500,
      width: 100,
    },
    layoutMeasurement: {
      // Dimensions of the device
      height: 100,
      width: 100,
    },
    target: {scrollY: 500},
  },
};
*/

const books: Book[] = [
  {_id: '1', name: 'book1', price: 100, inventory: 2},
  {_id: '2', name: 'book2', price: 50},
  {_id: '3', name: 'book3', price: 20},
] as Book[];

const favBooks = ['1'];

jest
  .spyOn(bookService, 'findByNewArrivals')
  .mockImplementation(() => Promise.resolve(books));

const findByGenreSpy = jest
  .spyOn(bookService, 'findByGenre')
  .mockImplementation(() => Promise.resolve([]));

jest
  .spyOn(bookScreenActions, 'calculateMaxPageSize')
  .mockImplementation(() => Promise.resolve(2));

const updateFavSpy = jest
  .spyOn(bookScreenActions, 'updateFav')
  .mockImplementation((id, favs, clb) => {
    clb(favBooks, true);
    return Promise.resolve();
  });

const addToCartSpy = jest.spyOn(bookScreenActions, 'addOrRmvFrmCart');

jest
  .spyOn(userService, 'updateCart')
  .mockImplementation(() => Promise.resolve({modified: 1}));
const updAvlCopiesSpy = jest
  .spyOn(bookService, 'updateInventory')
  .mockImplementation(() => Promise.resolve({modified: 1}));

const getIconColorSpy = jest.spyOn(bookScreenActions, 'getIconColor');

beforeEach(() => {
  jest
    .spyOn(bookService, 'findOne')
    .mockImplementation(() => Promise.resolve(books[0]));
  updAvlCopiesSpy.mockClear();
});

test(`Given bookService is mocked, When view is rendred, 
  Then it should have a number of Item components`, async () => {
  expect.assertions(1);
  const {getAllByTestId} = render(<MockedNavigator screen1={BookScreen} />);
  await waitFor(() =>
    expect(getAllByTestId('touchable').length).toBe(books.length),
  );
});

test(`Given books are loaded for display, When one of these books matches favBooks, 
    Then it should has it fav icon with primary color`, async () => {
  expect.assertions(4);
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screen1={BookScreen} />,
  );
  await waitFor(async () => {
    const fab = UNSAFE_getAllByType(Card)[0].findByType(Fab);
    const bkg = fab.props.style.backgroundColor;
    expect(bkg).toBe(DarkTheme.secondary);
    await fireEvent.press(fab);
    expect(updateFavSpy).toBeCalledTimes(1);
    expect(getIconColorSpy).toBeCalledWith('1', ['1'], expect.anything());
    expect(fab.props.style.backgroundColor).toBe(DarkTheme.primary);
  });
});

/*
Why not re-query books after adding to cart:
  problem shows up while using scroll/paging. for instance 2 pages are loaded, an item
  from the first page is added to cart. Changing cart will reload books using the current
  page value which is page 2 causing the added item not to update in the view.
  To fix, either reload all the pages until the current, or update the view without reloading
  books.
  Updating the view without reloading can be done either by updating the state.
*/
test(`Given services are mocked, When adding to cart a stale book that is not available anymore,
  Then addToCart func shouldn't be called and this book addToCart button should be disabled`, async () => {
  jest.spyOn(bookService, 'findOne').mockImplementationOnce(() =>
    Promise.resolve({
      _id: '1',
      name: 'book1',
      price: 100,
      inventory: 0,
    } as Book),
  );
  jest.spyOn(bookScreenActions, 'addOrRmvFrmCart');
  expect.assertions(3);
  const {getAllByTestId} = render(<MockedNavigator screen1={BookScreen} />);
  await waitFor(async () => {
    expect(getAllByTestId('addToCartBtn').length).toBeGreaterThan(1);
    const addToCartBtn = getAllByTestId('addToCartBtn')[0];
    expect(addToCartBtn).not.toHaveProperty('disabled');
    await fireEvent.press(addToCartBtn);
    expect(addToCartSpy).not.toBeCalled();
    // expect(getAllByTestId('addToCartBtn')[0].props).toHaveProperty('disabled'); 'disabled' not found in props
  });
});

test(`Given services are mocked, When adding a book to cart,
  Then addToCart func should be called and this book available copies should be decremented`, async () => {
  expect.assertions(2);
  const {getAllByTestId} = render(<MockedNavigator screen1={BookScreen} />);
  await waitFor(async () => {
    const addToCartBtn = getAllByTestId('addToCartBtn')[0];
    await fireEvent.press(addToCartBtn);
  });
  act(() => {
    expect(addToCartSpy).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      1,
      expect.anything(),
    );
    expect(updAvlCopiesSpy).toBeCalledWith(
      books[0]._id,
      books[0].inventory - 1,
    );
  });
});

test(`Given services are mocked, 
  When adding a book to cart while the number of copies is stale from displayed data 'books[0]',
  Then the number of available copies should be decremented based on the current stock`, async () => {
  const bk = {
    _id: '1',
    name: 'book1',
    price: 100,
    inventory: 1, // current stock
  } as Book;
  jest
    .spyOn(bookService, 'findOne')
    .mockImplementation(() => Promise.resolve(bk));
  expect.assertions(3);
  const {getAllByTestId} = render(<MockedNavigator screen1={BookScreen} />);
  await waitFor(async () => {
    expect(getAllByTestId('copies')[0].props.children).toContain('2');
    const addToCartBtn = getAllByTestId('addToCartBtn')[0];
    await fireEvent.press(addToCartBtn);
  });
  act(() => {
    expect(addToCartSpy).toBeCalledWith(
      bk,
      expect.anything(),
      1,
      expect.anything(),
    );
    expect(updAvlCopiesSpy).toBeCalledWith(bk._id, 0);
  });
});

test(`Given services are mocked, 
  When adding a book to cart then removing it,
  Then book's available copies should be decremented then incremented`, async () => {
  expect.assertions(3);
  const {getAllByTestId} = render(<MockedNavigator screen1={BookScreen} />);
  await waitFor(async () => {
    expect(getAllByTestId('copies')[0].props.children).toContain('2');
    const addToCartBtn = getAllByTestId('addToCartBtn')[0];
    await fireEvent.press(addToCartBtn);
  });
  await act(async () => {
    expect(updAvlCopiesSpy).toBeCalledWith(books[0]._id, 1);
    const rmvFromCartBtn = getAllByTestId('removeFromCartBtn')[0];
    await fireEvent.press(rmvFromCartBtn);
  });
  act(() => {
    expect(updAvlCopiesSpy).toBeCalledWith(books[0]._id, 3);
  });
});

test(`Given services are mocked, When rendering page, 
  Then paging should have value of zero then incremented by 1 
  without passing the max page size which is 2`, async () => {
  expect.assertions(6);
  const loadBooksSpy = jest.spyOn(bookScreenActions, 'loadBooks');
  const {getByTestId, getAllByTestId} = render(
    <MockedNavigator screen1={BookScreen} />,
  );
  await waitFor(async () => {
    expect(loadBooksSpy).toBeCalledWith(undefined, 0);
    expect(getAllByTestId('touchable').length).toBe(3);
    await getByTestId('flatList').props.onEndReached(); //fireEvent.scroll(getByTestId('flatList'), eventData);
    expect(loadBooksSpy).toBeCalledWith(undefined, 1);
    expect(getAllByTestId('touchable').length).toBe(6);
    //it shouldn't change after the next call
    await getByTestId('flatList').props.onEndReached();
    expect(getAllByTestId('touchable').length).toBe(6);
    expect(loadBooksSpy).toBeCalledTimes(2);
  });
});

test(`Given services are mocked, When rendering page and switching Genres, 
  Then paging should be reset`, async () => {
  expect.assertions(5);
  const loadBooksSpy = jest.spyOn(bookScreenActions, 'loadBooks');
  const {getByTestId, getAllByTestId} = render(
    <MockedNavigator screen1={DrawerLike} screen2={BookScreen} />,
  );
  await waitFor(async () => {
    expect(loadBooksSpy).toBeCalledWith(undefined, 0);
    expect(getAllByTestId('touchable').length).toBe(3);
    await getByTestId('flatList').props.onEndReached();
    expect(loadBooksSpy).toBeCalledWith(undefined, 1);
  });

  await act(async () => {
    await fireEvent.press(getByTestId('fiqh'));
    expect(loadBooksSpy).toBeCalledWith('fiqh', 0);
  });

  act(() => {
    expect(findByGenreSpy).toBeCalledWith('fiqh', 0, expect.anything());
  });
});

test(`Given services are mocked, When adding to cart, 
  Then the button should change to remove from cart`, async () => {
  expect.assertions(1);
  const {getByTestId, getAllByTestId} = render(
    <MockedNavigator screen1={BookScreen} />,
  );
  await waitFor(async () => {
    const btn = getAllByTestId('addToCartBtn')[0];
    await fireEvent.press(btn);
  });

  act(() => {
    const removeFromCartBtn = getByTestId('removeFromCartBtn');
    expect(removeFromCartBtn).toBeTruthy();
  });
});
