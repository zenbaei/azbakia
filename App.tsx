import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {ReactNode} from 'react';
import {StatusBar} from 'react-native';
import {NavigationScreens} from 'constants/navigation-screens';
import {AppBarColorProps} from 'zenbaei-js-lib';
import Colors from 'constants/app-colors';
import LoginScreen from 'view/login-screen';
import {getMessages} from 'constants/in18/messages';
import {HomeScreen} from 'view/home-screen';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

const Stack = createStackNavigator<NavigationScreens>();
//adding icons
library.add(faArrowLeft);

const App = (): ReactNode => {
  StatusBar.setBackgroundColor(Colors.statusBar);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="loginScreen"
          component={LoginScreen}
          options={{
            title: getMessages().login,
            ...AppBarColorProps(
              Colors.appBar,
              Colors.onSurface,
              Colors.onSurface,
            ),
          }}
        />
        <Stack.Screen
          name="homeScreen"
          component={HomeScreen}
          options={{
            title: getMessages().home,
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
