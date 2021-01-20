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
import {BookScreen} from '../book-screen';
import {Item, Accordion} from 'react-native-paper/src/components/List/List';
import {BookDetailsScreen} from 'view/book-details-screen';
import {getAppTheme} from 'zenbaei-js-lib/theme';
import {LookInsideBookScreen} from 'view/look-inside-book-screen';
import {NavigationProps} from 'zenbaei-js-lib/react';

const Drawer = createDrawerNavigator<NavigationScreens>();

export function DrawerNavigator({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'drawerNavigator'>) {
  useEffect(() => {}, []);
  return (
    <Drawer.Navigator
      initialRouteName={'bookScreen'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{backgroundColor: getAppTheme().background}}
      drawerContentOptions={{labelStyle: {color: getAppTheme().onSurface}}}>
      <Drawer.Screen
        name="bookScreen"
        component={BookScreen}
        options={{title: getMessages().home}}
        initialParams={{
          favBooks: route.params.favBooks,
          booksInCart: route.params.booksInCart,
        }}
      />
      <Drawer.Screen
        name="bookDetailsScreen"
        component={BookDetailsScreen}
        options={{title: getMessages().bookDetails}}
      />
      <Drawer.Screen
        name="lookInsideBookScreen"
        component={LookInsideBookScreen}
        options={{title: getMessages().lookInside}}
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
        onPress={() => props.navigation.navigate('bookScreen')}
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
