import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Zenbaei} from 'zenbaei-js-lib/react';
import {initialValue, UserContext} from '../../src/user-context';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import {Cart} from '../../src/domain/user/user';

const Stack = createStackNavigator();
const MockedNavigator = ({
  screen1,
  screen2 = ({navigation, route}) => {
    return <></>;
  },
  cart,
}: {
  screen1: any;
  screen2?: any;
  cart?: Cart[];
}) => {
  return (
    <Zenbaei useTheme={DarkTheme}>
      <MockedUserContextProvider cart={cart}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="passedScreen1" component={screen1} />
            <Stack.Screen name="bookScreen" component={screen2} />
          </Stack.Navigator>
        </NavigationContainer>
      </MockedUserContextProvider>
    </Zenbaei>
  );
};

export default MockedNavigator;

const MockedUserContextProvider = ({cart, children}) => {
  return (
    <UserContext.Provider value={{...initialValue, cart: cart}}>
      {children}{' '}
    </UserContext.Provider>
  );
};
