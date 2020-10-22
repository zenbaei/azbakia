import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {ReactNode} from 'react';
import {StatusBar} from 'react-native';
import appColors from 'resources/app-colors';
import {NavigationScreens} from 'resources/navigation-screens';
import LoginScreen from 'src/view/login-screen';
import {AppBarStyle} from 'zenbaei_js_lib/react/resources/styles';
const Stack = createStackNavigator<NavigationScreens>();

const App = (): ReactNode => {
  StatusBar.setBackgroundColor(appColors.statusBar);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="loginScreen"
          component={LoginScreen}
          options={{title: 'Login', ...AppBarStyle}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
