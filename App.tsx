import 'react-native-gesture-handler';
import {DrawerActions, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {ReactNode, useEffect} from 'react';
import {StatusBar, TouchableOpacity} from 'react-native';
import {NavigationScreens} from 'constants/navigation-screens';
import {
  AppBarColors,
  Button,
  NavigationProps,
  Text,
} from 'zenbaei-js-lib/react';
import LoginScreen from 'view/login-screen';
import {getMessages} from 'constants/in18/messages';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FileLogger} from 'react-native-file-logger';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import {BookDetailsScreen} from 'view/book-details-screen';
import {DrawerNavigation} from 'view/drawer-navigation';
const Stack = createStackNavigator<NavigationScreens>();

//adding icons
library.add(faArrowLeft);
FileLogger.configure({captureConsole: false});
global.FileLog = (msg: string | object) => {
  FileLogger.error(msg as string);
};

global.LogLevel = 'Debug';
global.AppTheme = DarkTheme;

const App = (): ReactNode => {
  StatusBar.setBackgroundColor(global.AppTheme.statusBar);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="loginScreen"
          component={LoginScreen}
          options={{
            title: getMessages().login,
            ...AppBarColors,
          }}
        />
        <Stack.Screen
          name="drawerNavigation"
          component={DrawerNavigation}
          options={{
            title: getMessages().home,
            ...AppBarColors,
          }}
        />
        <Stack.Screen
          name="bookDetailsScreen"
          component={BookDetailsScreen}
          options={{
            title: getMessages().bookDetails,
            ...AppBarColors,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
