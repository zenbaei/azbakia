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
import {
  Item,
  Accordion,
  Icon,
} from 'react-native-paper/src/components/List/List';
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="bookScreen"
        component={BookScreen}
        options={{title: getMessages().home}}
        initialParams={{
          fav: route.params.fav,
          cart: route.params.cart,
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
        label={getMessages().home}
        onPress={() => props.navigation.navigate('bookScreen')}
      />
      <Accordion title={getMessages().bookGenre}>
        {bookGenres.map((genre) => (
          <Item key={genre} title={genre} />
        ))}
      </Accordion>
      <DrawerItem
        label="Profile"
        onPress={() => console.log('go to profile')}
      />
    </DrawerContentScrollView>
  );
}
