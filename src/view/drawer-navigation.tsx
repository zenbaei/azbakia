import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {getMessages} from 'constants/in18/messages';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useEffect} from 'react';
import IconButton from 'react-native-paper/src/components/IconButton';
import {NavigationProps} from 'zenbaei-js-lib/react';
import {HomeScreen} from './home-screen';
import {Item, Accordion} from 'react-native-paper/src/components/List/List';

const Drawer = createDrawerNavigator<NavigationScreens>();

export function DrawerNavigation({
  navigation,
}: NavigationProps<NavigationScreens, 'drawerNavigation'>) {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <IconButton
            icon="menu"
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        );
      },
    });
  }, []);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="homeScreen"
        component={HomeScreen}
        options={{
          title: getMessages().home,
        }}
      />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Accordion title="Book Genre">
        <Item title="Novels" />
        <Item title="Sience fiction" />
      </Accordion>
      <DrawerItem
        label="Profile"
        onPress={() => console.log('go to profile')}
      />
    </DrawerContentScrollView>
  );
}
