import React, {useCallback, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {initialValue, UserContext} from '../../src/user-context';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import {Cart} from '../../src/domain/user/user';
import {messagesEn} from '../../src/constants/in18/messages-en';

const Stack = createStackNavigator();
const MockedNavigator = ({
  screen1,
  screen2 = ({navigation, route}) => {
    return <></>;
  },
  cart = [],
  favs = [],
}: {
  screen1: any;
  screen2?: any;
  cart?: Cart[];
  favs?: string[];
}) => {
  return (
    <MockedUserContextProvider car={cart} fav={favs}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="passedScreen1" component={screen1} />
          <Stack.Screen name="bookScreen" component={screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </MockedUserContextProvider>
  );
};

export default MockedNavigator;

const MockedUserContextProvider = ({car, fav, children}) => {
  const [cart, updCart] = useState(car);
  const [favs, updFavs] = useState(fav);

  const setCart = useCallback((crt: Cart[]) => updCart(crt), []);
  const setFavs = useCallback((fvs: string[]) => updFavs(fvs), []);

  return (
    <UserContext.Provider
      value={{
        ...initialValue,
        cart: cart,
        favs: favs,
        theme: DarkTheme,
        msgs: messagesEn,
        setFavs: setFavs,
        setCart: setCart,
      }}>
      {children}
    </UserContext.Provider>
  );
};
