import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {getMessages} from 'constants/in18/messages';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useEffect, useState} from 'react';
import {HomeScreen} from '../home-screen';
import {Item, Accordion} from 'react-native-paper/src/components/List/List';
import {BookDetailsScreen} from 'view/book-details-screen';
import {getAppTheme} from 'zenbaei-js-lib/theme';

const Drawer = createDrawerNavigator<NavigationScreens>();

export function DrawerNavigator() {
  useEffect(() => {}, []);
  return (
    <Drawer.Navigator
      initialRouteName={'homeScreen'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{backgroundColor: getAppTheme().background}}
      drawerContentOptions={{labelStyle: {color: getAppTheme().onSurface}}}>
      <Drawer.Screen
        name="homeScreen"
        component={HomeScreen}
        options={{title: getMessages().home}}
      />
      <Drawer.Screen
        name="bookDetailsScreen"
        component={BookDetailsScreen}
        options={{title: getMessages().bookDetails}}
      />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  const [bookGenres, setBookGenres] = useState(['Novels', 'History']);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        labelStyle={{color: getAppTheme().onSurface}}
        label="Home"
        onPress={() => props.navigation.navigate('homeScreen')}
      />
      <Accordion
        titleStyle={{color: getAppTheme().onSurface}}
        title="Book Genre">
        {bookGenres.map((genre) => (
          <Item
            titleStyle={{color: getAppTheme().onSurface}}
            key={genre}
            title={genre}
          />
        ))}
      </Accordion>
      <DrawerItem
        labelStyle={{color: getAppTheme().onSurface}}
        label="Profile"
        onPress={() => console.log('go to profile')}
      />
    </DrawerContentScrollView>
  );
}