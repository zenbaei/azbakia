/* eslint-disable @typescript-eslint/no-unused-vars */
import {NavigationScreens} from 'constants/navigation-screens';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavigationAction, StackNavigationState} from '@react-navigation/native';
import {User} from 'user/user';

export const StackNavigationPropStub: StackNavigationProp<
  NavigationScreens,
  'loginScreen'
> = {
  dispatch(
    action:
      | NavigationAction
      | ((state: StackNavigationState<NavigationScreens>) => {}),
  ) {},

  navigate: () => {},
  reset: () => {},
  isFocused: (): boolean => {
    return true;
  },
  canGoBack: (): boolean => {
    return true;
  },
  goBack: () => {},
  dangerouslyGetState: (): StackNavigationState<NavigationScreens> => {
    return {
      index: 1,
      key: 'key1',
      routeNames: ['loginScreen', 'homeScreen'],
      type: 'stack',
      stale: false,
      routes: [{key: 'loginScreen', name: 'loginScreen', params: User}],
    };
  },
  dangerouslyGetParent: () => {
    return undefined;
  },
};

/*
{
    navProps: {loginScreen: undefined},
    str: 'loginScreen',
    many: {
      index: 1,
      key: 'key1',
      routeNames: ['loginScreen', 'homeScreen'],
      type: 'stack',
      stale: false,
      routes: [
        {key: 'loginScreen', name: 'loginScreen', params: User},
        'loginScreen',
      ],
      emp: {},
      emp2: {},
    }
}
*/
