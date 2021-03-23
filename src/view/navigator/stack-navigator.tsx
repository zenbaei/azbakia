import React, {useContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationScreens} from 'constants/navigation-screens';
import {getMessages} from 'constants/in18/messages';
import {getNavigatorHeaderStyle, Button, Ctx} from 'zenbaei-js-lib/react';
import IconButton from 'react-native-paper/src/components/IconButton';
import {DrawerActions} from '@react-navigation/native';
import LoginScreen from 'view/login/login-screen';
import {DrawerNavigator} from './drawer-navigator';
import {ViewStyle} from 'react-native';

const Stack = createStackNavigator<NavigationScreens>();

export function StackNavigator() {
  const [label, setLabel] = useState('');
  const [appBarTitle, setAppBarTitle] = useState('');
  const [displayCartBtn, setDisplayCartBtn] = useState(
    'none' as 'none' | 'flex' | undefined,
  );
  global.setRightHeaderLabel = setLabel;
  global.setAppBarTitle = setAppBarTitle;
  global.setDisplayCartBtn = setDisplayCartBtn;
  const {theme} = useContext(Ctx);

  const _displayMenuIcon = (routeName: string): ViewStyle => {
    return {display: routeName !== 'loginScreen' ? 'flex' : 'none'};
  };

  return (
    <Stack.Navigator
      screenOptions={({navigation, route}) => ({
        headerLeft: () => {
          return (
            <IconButton
              style={_displayMenuIcon(route.name)}
              color={theme.onSurface}
              icon="menu"
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          );
        },
        headerRight: () => {
          return (
            <Button
              style={{display: displayCartBtn}}
              label={label ? label : getMessages().cart}
              onPress={() => navigation.navigate('cartScreen')}
            />
          );
        },
        headerTitle: appBarTitle,
        ...getNavigatorHeaderStyle(theme),
      })}>
      <Stack.Screen name="loginScreen" component={LoginScreen} />
      <Stack.Screen name="drawerNavigator" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
