import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {ReactNode} from 'react';
import {StatusBar} from 'react-native';
import {NavigationScreens} from 'constants/navigation-screens';
import {AppBarColorProps} from 'zenbaei_js_lib';
import Colors from 'constants/app-colors';
import LoginScreen from 'view/login-screen';
const Stack = createStackNavigator<NavigationScreens>();

const App = (): ReactNode => {
  StatusBar.setBackgroundColor(Colors.statusBar);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="loginScreen"
          component={LoginScreen}
          options={{
            title: 'Login',
            ...AppBarColorProps(
              Colors.appBar,
              Colors.onSurface,
              Colors.onSurface,
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
