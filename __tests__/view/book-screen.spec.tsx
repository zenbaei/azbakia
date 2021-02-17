import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationPropStub} from '../stubs/stack-navigation-prop-stub';
import {NavigationScreens} from '../../src/constants/navigation-screens';
import {BookScreen} from '../../src/view/book-screen';
import {render, waitFor} from '@testing-library/react-native';

const books: any[] = [
  {name: 'book1', price: 100},
  {name: 'book2', price: 50},
  {name: 'book3', price: 20},
];

const mockFindByNewArrivals = jest.fn().mockResolvedValue(books);

const navigation = new StackNavigationPropStub<
  NavigationScreens,
  'bookScreen'
>();
const route: RouteProp<NavigationScreens, 'bookScreen'> = {
  key: 'books',
  name: 'bookScreen',
  params: {favBooks: ['book1', 'book3'], booksInCart: ['book2']},
};

jest.mock('../../src/book/book-service', () => {
  return function () {
    return {
      findByNewArrivals: mockFindByNewArrivals,
    };
  };
});

test(`Given bookService is mocked, When view is rendred, 
  Then it should have a number of Item components`, async () => {
  expect.assertions(1);

  const {getAllByTestId} = render(
    <BookScreen navigation={navigation} route={route} />,
  );

  await waitFor(() =>
    expect(getAllByTestId('touchable').length).toBe(books.length),
  );
});

test.skip(`Given books are loaded for display, When one of these books matches favBooks, 
    Then it should has it fav icon with primary color`, () => {
  const {getByTestId} = render(
    <BookScreen navigation={navigation} route={route} />,
  );
});
