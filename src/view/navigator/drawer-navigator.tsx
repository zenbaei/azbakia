import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {getMessages} from 'constants/in18/messages';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useState} from 'react';
import {BookScreen} from '../book/book-screen';
import {Item, Accordion} from 'react-native-paper/src/components/List/List';
import {BookDetailsScreen} from 'view/book-details-screen';
import {LookInsideBookScreen} from 'view/look-inside-book-screen';
import {NavigationProps} from 'zenbaei-js-lib/react';
import {CartScreen} from 'view/cart/cart-screen';
import {DeliveryScreen} from 'view/delivery/delivery-screen';

const Drawer = createDrawerNavigator<NavigationScreens>();

export function DrawerNavigator({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'drawerNavigator'>) {
  return (
    <Drawer.Navigator
      initialRouteName={'bookScreen'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="bookScreen"
        component={BookScreen}
        initialParams={{
          genre: undefined,
        }}
      />
      <Drawer.Screen name="bookDetailsScreen" component={BookDetailsScreen} />
      <Drawer.Screen
        name="lookInsideBookScreen"
        component={LookInsideBookScreen}
      />
      <Drawer.Screen name="cartScreen" component={CartScreen} />
      <Drawer.Screen name="deliveryScreen" component={DeliveryScreen} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  const [bookGenres] = useState(['Novels', 'History']);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={getMessages().home}
        onPress={() =>
          props.navigation.navigate('bookScreen', {
            genre: undefined,
          })
        }
      />
      <Accordion title={getMessages().bookGenre}>
        {bookGenres.map((genre) => (
          <Item
            key={genre}
            title={genre}
            onPress={() => {
              props.navigation.navigate('bookScreen', {
                genre: genre,
              });
            }}
          />
        ))}
      </Accordion>
      <DrawerItem
        label="Profile"
        onPress={() => console.log('go to profile')}
      />
    </DrawerContentScrollView>
  );
}
