import React, {useContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationScreens} from 'constants/navigation-screens';
import {
  getNavigatorHeaderStyle,
  Button,
  Ctx,
  ForgetPassword,
  Register,
} from 'zenbaei-js-lib/react';
import IconButton from 'react-native-paper/src/components/IconButton';
import {DrawerActions} from '@react-navigation/native';
import LoginScreen from 'view/login/login-screen';
import {DrawerNavigator} from './drawer-navigator';
import {ViewStyle} from 'react-native';
import {getMessages} from 'constants/in18/messages-interface';
import {UnexpectedErrorScreen} from 'view/unexpected-error-screen';

const Stack = createStackNavigator<NavigationScreens>();

export function StackNavigator() {
  const [label, setLabel] = useState('');
  const [appBarTitle, setAppBarTitle] = useState('');
  const [displayCartBtn, setDisplayCartBtn] = useState(false);
  global.setRightHeaderLabel = setLabel;
  global.setAppBarTitle = setAppBarTitle;
  global.setDisplayCartBtn = (cart?: any[]) => {
    cart && cart?.length > 0
      ? setDisplayCartBtn(true)
      : setDisplayCartBtn(false);
  };
  const {theme, language} = useContext(Ctx);

  const _displayMenuIcon = (routeName: string): ViewStyle => {
    return {
      display:
        routeName !== 'loginScreen' &&
        routeName !== 'registerScreen' &&
        routeName !== 'forgetPasswordScreen'
          ? 'flex'
          : 'none',
    };
  };

  return (
    <Stack.Navigator
      screenOptions={({navigation, route}) => ({
        headerLeft: () => {
          return (
            <IconButton
              style={_displayMenuIcon(route.name)}
              color={theme.onPrimary}
              icon="menu"
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          );
        },
        headerRight: () => {
          return (
            <Button
              visible={displayCartBtn}
              label={label ? label : getMessages(language).cart}
              onPress={() => navigation.navigate('cartScreen')}
            />
          );
        },
        headerTitle: appBarTitle,
        ...getNavigatorHeaderStyle(theme),
      })}>
      <Stack.Screen name="loginScreen" component={LoginScreen} />
      <Stack.Screen name="registerScreen" component={Register} />
      <Stack.Screen name="forgetPasswordScreen" component={ForgetPassword} />
      <Stack.Screen name="drawerNavigator" component={DrawerNavigator} />
      <Stack.Screen
        name="unexpectedErrorScreen"
        component={UnexpectedErrorScreen}
      />
    </Stack.Navigator>
  );
}
