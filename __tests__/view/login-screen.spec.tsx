import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import LoginScreen from 'view/login-screen';

import {StackNavigationProp} from '@react-navigation/stack';
import {NavigationScreens} from 'constants/navigation-screens';
import {act} from 'react-test-renderer';
import {StackNavigationPropStub} from '../stubs/stack-navigation-prop-stub';
import {User} from 'user/user';
import {getUser} from 'user/user-service';

const navigation: StackNavigationProp<
  NavigationScreens,
  'loginScreen'
> = StackNavigationPropStub;

const navigate: any = jest.spyOn(navigation, 'navigate');
const userService = require('../../src/user/user-service');

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
    .spyOn(userService, 'getUser')
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
  Then it should call navigate`, async () => {
  expect.assertions(2);
  const user: User = {email: 'islam'};

  jest
    .spyOn(userService, 'getUser')
    .mockImplementation(() => Promise.resolve(user));

  const getUserReturn: User = (await getUser('any', 'value')) as User;
  expect(getUserReturn.email).toBe('islam');

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

  expect(navigate).toHaveBeenCalledWith('homeScreen', user);
});
