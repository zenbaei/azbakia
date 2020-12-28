import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationScreens} from 'constants/navigation-screens';
import {getMessages} from 'constants/in18/messages';
import {NavigatorHeaderStyle, Button} from 'zenbaei-js-lib/react';
import IconButton from 'react-native-paper/src/components/IconButton';
import {DrawerActions} from '@react-navigation/native';
import LoginScreen from 'view/login-screen';
import {DrawerNavigator} from './drawer-navigator';

const Stack = createStackNavigator<NavigationScreens>();

export function StackNavigator() {
  const [label, setLabel] = useState('');
  global.setRightHeaderLabel = setLabel;

  return (
    <Stack.Navigator
      screenOptions={({navigation, route}) => ({
        headerLeft: () => {
          return route.name !== 'loginScreen' ? (
            <IconButton
              color="white"
              icon="menu"
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          ) : (
            <></>
          );
        },
        headerRight: () => {
          return route.name !== 'loginScreen' ? (
            <Button
              label={label ? label : 'Checkout'}
              onPress={() => navigation.navigate('checkoutScreen')}
            />
          ) : (
            <></>
          );
        },
        ...NavigatorHeaderStyle,
      })}>
      <Stack.Screen
        name="loginScreen"
        component={LoginScreen}
        options={{
          title: getMessages().login,
        }}
      />
      <Stack.Screen
        name="drawerNavigator"
        component={DrawerNavigator}
        options={{
          title: getMessages().home,
        }}
      />
    </Stack.Navigator>
  );
}
