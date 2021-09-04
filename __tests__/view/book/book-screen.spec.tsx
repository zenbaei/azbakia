import React from 'react';
import {BookScreen} from '../../../src/view/book/book-screen';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import MockedNavigator from '../../stubs/mocked-navigator';
import {bookService} from '../../../src/domain/book/book-service';
import {Card, Fab} from 'zenbaei-js-lib/react';
import {Book} from '../../../src/domain/book/book';
import * as bookScreenActions from '../../../src/view/book/book-screen-actions';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import {DrawerMock} from '../../stubs/drawer-mock';
import {act} from 'react-test-renderer';
import {userService} from '../../../src/domain/user/user-service';
import {messagesEn} from '../../../src/constants/in18/messages-en';
import '@testing-library/jest-native/extend-expect';
import {pageSize} from '../../../app.config';

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
  .spyOn(bookScreenActions, 'loadFirstBooksPageAndCalcTotalPagesNumber')
  .mockImplementation((genre, clb) => {
    clb(books, 2);
    return Promise.resolve();
  });

const searchBooksSpy = jest.spyOn(
  bookScreenActions,
  'loadFirstSearchedBooksPageAndCalcTotalPageNumber',
);

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
  searchBooksSpy.mockClear();
});

test(`Given bookService is mocked, When view is rendred, 
  Then it should have a number of Item components`, async () => {
  expect.assertions(1);
  const {getAllByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
  await waitFor(() =>
    expect(getAllByTestId('touchable').length).toBe(books.length),
  );
});

test(`Given books are loaded for display, When adding a book to favourite, 
    Then it should change its color to secondary`, async () => {
  expect.assertions(4);
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
  await waitFor(async () => {
    const fab = UNSAFE_getAllByType(Card)[0].findByType(Fab);
    const bkg = fab.props.style.backgroundColor;
    expect(bkg).toBe(DarkTheme.primary);
    await fireEvent.press(fab);
    expect(updateFavSpy).toBeCalledTimes(1);
    expect(getIconColorSpy).toBeCalledWith('1', [], expect.anything());
    expect(fab.props.style.backgroundColor).toBe(DarkTheme.secondary);
  });
});

test(`Given a book is included in favourites, When displaying this book favourite icon, 
    Then it should have secondary color`, async () => {
  expect.assertions(1);
  const {UNSAFE_getAllByType} = render(
    <MockedNavigator
      screens={[{name: 'bookScreen', component: BookScreen}]}
      favs={['1']}
    />,
  );
  await waitFor(async () => {
    const fab = UNSAFE_getAllByType(Card)[0].findByType(Fab);
    const bkg = fab.props.style.backgroundColor;
    expect(bkg).toBe(DarkTheme.secondary);
  });
});

/*
Why not re-query books after adding to cart:
  problem shows up while using scroll/paging. for instance 2 pages are loaded,
  we scrolled down to 2nd page (page var is now = 2) then we scrolled up to buy and item
  from the first page. Changing cart will reload books using the current
  page value which is page 2 causing the added item not to update in the view.
  To fix, either reload all the pages until the current, or update the view without reloading
  books.
  Updating the view without reloading can be done by updating the state.
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
  expect.assertions(4);
  const {getAllByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
  await waitFor(async () => {
    expect(getAllByTestId('addToCartBtn').length).toBeGreaterThan(1);
    const addToCartBtn = getAllByTestId('addToCartBtn')[0];
    expect(addToCartBtn).not.toBeDisabled();
    await fireEvent.press(addToCartBtn);
    expect(addToCartSpy).not.toBeCalled();
    expect(getAllByTestId('addToCartBtn')[0]).toBeDisabled();
  });
});

test.todo(`test alert when stale displayed book becomes not available`);

test(`Given services are mocked, When adding a book to cart,
  Then addToCart func should be called and this book available copies should be decremented`, async () => {
  expect.assertions(2);
  const {getAllByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
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
  const {getAllByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
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
  const {getAllByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
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
  expect.assertions(5);
  const loadBooksByPageSpy = jest.spyOn(bookScreenActions, 'loadBooksByPage');
  const {getByTestId, getAllByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
  await waitFor(async () => {
    expect(getAllByTestId('touchable').length).toBe(3);
    await getByTestId('flatList').props.onEndReached(); //fireEvent.scroll(getByTestId('flatList'), eventData);
    expect(loadBooksByPageSpy).toBeCalledWith(undefined, 1);
    expect(getAllByTestId('touchable').length).toBe(6);
    //it shouldn't change after the next call
    await getByTestId('flatList').props.onEndReached();
    expect(getAllByTestId('touchable').length).toBe(6);
    expect(loadBooksByPageSpy).toBeCalledTimes(1);
  });
});

test(`Given services are mocked, When rendering page and switching Genres, 
  Then paging should be reset`, async () => {
  expect.assertions(6);
  const loadFirstBooksPageSpy = jest
    .spyOn(bookScreenActions, 'loadFirstBooksPageAndCalcTotalPagesNumber')
    .mockImplementationOnce((genere, clb) => {
      clb(books, 2);
      return Promise.resolve();
    });
  const loadBooksByPageSpy = jest.spyOn(bookScreenActions, 'loadBooksByPage');

  const {getByTestId, getAllByTestId} = render(
    <MockedNavigator
      screens={[
        {name: 'drawerNavigator', component: DrawerMock},
        {name: 'bookScreen', component: BookScreen},
      ]}
    />,
  );
  await waitFor(async () => {
    await fireEvent.press(getByTestId('hadith'));
    expect(getAllByTestId('touchable').length).toBe(3);
    expect(loadFirstBooksPageSpy).toBeCalledWith('hadith', expect.anything());
  });

  await act(async () => {
    await fireEvent.press(getByTestId('fiqh'));
  });

  await act(async () => {
    expect(loadFirstBooksPageSpy).toBeCalledWith('fiqh', expect.anything());
    expect(getAllByTestId('touchable').length).toBe(3);
    await getByTestId('flatList').props.onEndReached();
    expect(loadBooksByPageSpy).toBeCalledWith('fiqh', 1);
    expect(findByGenreSpy).toBeCalledWith('fiqh', 1 * pageSize, pageSize);
  });
});

test(`Given services are mocked, When adding to cart, 
  Then the button should change to remove from cart`, async () => {
  expect.assertions(1);
  const {getByTestId, getAllByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
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

test(`Given search text is entered and result exists, When user taps outside, 
  Then it should list the result`, async () => {
  expect.assertions(3);
  const searchResult = [
    {_id: '1', name: 'book1'},
    {_id: '2', name: 'book2'},
  ];
  jest
    .spyOn(bookScreenActions, 'searchBooksProjected')
    .mockResolvedValue(searchResult);
  searchBooksSpy.mockImplementation((token, clb) => {
    clb(searchResult, 1);
    return Promise.resolve();
  });
  const {getByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
  let flatList: any;
  await waitFor(async () => {
    flatList = getByTestId('flatList');
    expect(flatList.props.data.length).toBe(3);
    const searchInput = getByTestId('searchInput');
    await fireEvent.changeText(searchInput, 'book');
    await fireEvent(searchInput, 'blur');
  });
  act(() => {
    expect(searchBooksSpy).toBeCalled();
    expect(flatList.props.data.length).toBe(2);
  });
});

test(`Given search text is entered that has no result, When user taps outside, 
  Then it should make a search and show no result found`, async () => {
  expect.assertions(3);
  const searchResult = [];
  jest
    .spyOn(bookScreenActions, 'searchBooksProjected')
    .mockResolvedValue(searchResult);
  searchBooksSpy.mockImplementation((token, clb) => {
    clb(searchResult, 0);
    return Promise.resolve();
  });
  const {getByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
  let flatList: any;
  await waitFor(async () => {
    flatList = getByTestId('flatList');
    expect(flatList.props.data.length).toBe(3);
    const searchInput = getByTestId('searchInput');
    await fireEvent.changeText(searchInput, 'book');
    await fireEvent(searchInput, 'blur');
  });
  act(() => {
    expect(searchBooksSpy).toBeCalled();
    const noResultText = getByTestId('noResultFound');
    expect(noResultText.props.children).toBe(messagesEn.noResultFound);
  });
});

test(`Given search text is just tapped on or a space is entered, When user taps outside, 
  Then it should make no search and leave the displayed books as it is`, async () => {
  expect.assertions(3);
  const searchResult = [];
  jest
    .spyOn(bookScreenActions, 'searchBooksProjected')
    .mockResolvedValue(searchResult);

  searchBooksSpy.mockImplementation((token, clb) => {
    clb(searchResult, 1);
    return Promise.resolve();
  });
  const {getByTestId} = render(
    <MockedNavigator screens={[{name: 'bookScreen', component: BookScreen}]} />,
  );
  let flatList: any;
  await waitFor(async () => {
    flatList = getByTestId('flatList');
    expect(flatList.props.data.length).toBe(3);
    const searchInput = getByTestId('searchInput');
    await fireEvent.changeText(searchInput, '   ');
    await fireEvent(searchInput, 'blur');
  });
  act(() => {
    expect(searchBooksSpy).not.toBeCalled();
    expect(flatList.props.data.length).toBe(3);
  });
});
