import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Zenbaei} from 'zenbaei-js-lib/react';
import {UserContextProvider} from '../../src/user-context';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import {BookScreen} from '../../src/view/book/book-screen';

const Stack = createStackNavigator();
const MockedNavigator = ({component, params = {}}) => {
  return (
    <Zenbaei useTheme={DarkTheme}>
      <UserContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MockedScreen"
              component={component}
              initialParams={params}
            />
            <Stack.Screen name="bookScreen" component={BookScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContextProvider>
    </Zenbaei>
  );
};

export default MockedNavigator;
