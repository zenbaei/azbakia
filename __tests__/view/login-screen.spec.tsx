import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import LoginScreen from '../../src/view/login/login-screen';
import {act} from 'react-test-renderer';
import {StackNavigationPropStub} from '../stubs/stack-navigation-prop-stub';
import {NavigationScreens} from '../../src/constants/navigation-screens';
import {userService} from '../../src/domain/user/user-service';

const navigation = new StackNavigationPropStub<
  NavigationScreens,
  'loginScreen'
>();

const navigate: any = jest.spyOn(navigation, 'navigate');

test(`Given username and password were empty, When doing login, 
    Then it should not call navigate`, async () => {
  expect.assertions(1);
  const {getByText} = render(
    <LoginScreen
      navigation={navigation}
      route={{name: 'loginScreen', key: 'key1', params: {}}}
    />,
  );
  await fireEvent.press(getByText('Sign in'));
  expect(navigate).not.toHaveBeenCalled();
});

test(`Given username and password are filled but invalid, When doing login,
  Then it should not call navigation`, async () => {
  expect.assertions(1);
  jest
    .spyOn(userService, 'findByEmailAndPass')
    .mockImplementation(() => Promise.resolve(undefined));
  const {getByText, getByPlaceholderText} = render(
    <LoginScreen
      navigation={navigation}
      route={{name: 'loginScreen', key: 'key1', params: {}}}
    />,
  );
  fireEvent.changeText(getByPlaceholderText('email'), 'zenbaei@gmail.com');
  fireEvent.changeText(getByPlaceholderText('password'), 'pass');
  await act(async () => {
    await fireEvent.press(getByText('Sign in'));
  });
  expect(navigate).not.toHaveBeenCalled();
});

test(`Given username and password are valid and user exist on db, When doing login, 
  Then it should call navigate to next screen with the right route parameters`, async () => {
  expect.assertions(2);
  const user: any = {favBooks: ['book1']};

  jest
    .spyOn(userService, 'findByEmailAndPass')
    .mockImplementation(() => Promise.resolve(user));

  const {getByPlaceholderText, getByText} = render(
    <LoginScreen
      navigation={navigation}
      route={{name: 'loginScreen', key: 'key1', params: {}}}
    />,
  );
  fireEvent.changeText(getByPlaceholderText('email'), 'zenbaei@gmail.com');
  fireEvent.changeText(getByPlaceholderText('password'), 'pass');
  await act(async () => {
    await fireEvent.press(getByText('Sign in'));
  });

  expect(navigate).toHaveBeenCalledWith('drawerNavigator', {
    favBooks: user.favBooks,
    booksInCart: [],
  });
  expect(global.user.email).toEqual('zenbaei@gmail.com');
});
