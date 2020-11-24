import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import LoginScreen from 'view/login-screen';

import {StackNavigationProp} from '@react-navigation/stack';
import {NavigationScreens} from 'constants/navigation-screens';
import {RouteProp} from '@react-navigation/native';
import {ReactTestInstance} from 'react-test-renderer';
import {StackNavigationPropStub} from '../stubs/stack-navigation-prop-stub';

const navigation: StackNavigationProp<
  NavigationScreens,
  'loginScreen'
> = StackNavigationPropStub;

test(`Given username and password are invalid, When doing login, 
    Then it should not navigate and show an Error`, () => {
  const navigate: any = jest.spyOn(navigation, 'navigate');
  const {getByDisplayValue} = render(<LoginScreen navigation={navigation} />);
  fireEvent.press(getByDisplayValue('login'));
  expect(navigate).not.toHaveBeenCalled();
  const errors: ReactTestInstance = getByDisplayValue(
    'Wrong username or password',
  );
  expect(errors).toBeTruthy();
});
