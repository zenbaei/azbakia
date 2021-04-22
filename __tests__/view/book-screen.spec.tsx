import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationPropStub} from '../stubs/stack-navigation-prop-stub';
import {NavigationScreens} from '../../src/constants/navigation-screens';
import {BookScreen} from '../../src/view/book/book-screen';
import {render, waitFor} from '@testing-library/react-native';
//import {getAppTheme} from 'zenbaei-js-lib/theme';
import * as CommonActions from '../../src/view/common-actions';
import MockedNavigator from '../stubs/mocked-navigator';
import {bookService} from '../../src/domain/book/book-service';

const books: any[] = [
  {name: 'book1', price: 100},
  {name: 'book2', price: 50},
  {name: 'book3', price: 20},
];

const mockFindByNewArrivals = jest.fn().mockResolvedValue(books);
const getIconColorSpy = jest.spyOn(CommonActions, 'getIconColor');
const favBooks = ['book1', 'book3'];
const cartBooks = ['book2'];

const navigation = new StackNavigationPropStub<
  NavigationScreens,
  'bookScreen'
>();

const route: RouteProp<NavigationScreens, 'bookScreen'> = {
  key: 'books',
  name: 'bookScreen',
  params: {subGenre: undefined},
};

jest
  .spyOn(bookService, 'findByNewArrivals')
  .mockImplementation(() => Promise.resolve(books));

test(`Given bookService is mocked, When view is rendred, 
  Then it should have a number of Item components`, async () => {
  expect.assertions(1);
  const {getAllByTestId} = render(<MockedNavigator component={BookScreen} />);
  await waitFor(() =>
    expect(getAllByTestId('touchable').length).toBe(books.length),
  );
});

test.skip(`Given books are loaded for display, When one of these books matches favBooks, 
    Then it should has it fav icon with primary color`, async () => {
  expect.assertions(3);
  await waitFor(() =>
    render(<BookScreen navigation={navigation} route={route} />),
  );
  expect(getIconColorSpy).toHaveBeenNthCalledWith(1, 'book1', favBooks);
  expect(getIconColorSpy).nthReturnedWith(2, getAppTheme().secondary);
  expect(getIconColorSpy).toHaveBeenNthCalledWith(3, 'book3', favBooks);
  //expect(getIconColorSpy).nthReturnedWith(3, getAppTheme().primary);
});
