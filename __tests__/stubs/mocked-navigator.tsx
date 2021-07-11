import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Zenbaei} from 'zenbaei-js-lib/react';
import {UserContextProvider} from '../../src/user-context';
import {DarkTheme} from 'zenbaei-js-lib/constants';

const Stack = createStackNavigator();
const MockedNavigator = ({
  screen1,
  screen2 = ({navigation, route}) => {
    return <></>;
  },
  params = {},
}) => {
  return (
    <Zenbaei useTheme={DarkTheme}>
      <UserContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="passedScreen1"
              component={screen1}
              initialParams={params}
            />
            <Stack.Screen
              name="bookScreen"
              component={screen2}
              initialParams={params}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContextProvider>
    </Zenbaei>
  );
};

export default MockedNavigator;
