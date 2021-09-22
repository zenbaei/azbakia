import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext, useEffect, useState} from 'react';
import {BookScreen} from '../book/book-screen';
import {Item, Accordion} from 'react-native-paper/src/components/List/List';
import {BookDetailsScreen} from 'view/book/book-details-screen';
import {LookInsideBookScreen} from 'view/book/look-inside-book-screen';
import {CartScreen} from 'view/cart/cart-screen';
import {Genre} from 'domain/genre/genre';
import {genreService} from 'domain/genre/genre-service';
import {UserContext} from 'user-context';
import {AddressManagementScreen} from 'view/address/address-management-screen';
import {ProfileScreen} from 'view/profile/profile-screen';
import {AddressListScreen} from 'view/address/address-list-screen';
import {DeliveryScreen} from 'view/delivery/delivery-screen';

const Drawer = createDrawerNavigator<NavigationScreens>();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName={'bookScreen'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="bookScreen"
        component={BookScreen}
        initialParams={{
          subGenre: undefined,
        }}
      />
      <Drawer.Screen name="bookDetailsScreen" component={BookDetailsScreen} />
      <Drawer.Screen
        name="lookInsideBookScreen"
        component={LookInsideBookScreen}
      />
      <Drawer.Screen name="cartScreen" component={CartScreen} />
      <Drawer.Screen name="addressListScreen" component={AddressListScreen} />
      <Drawer.Screen
        name="addressManagementScreen"
        component={AddressManagementScreen}
      />
      <Drawer.Screen name="deliveryScreen" component={DeliveryScreen} />
      <Drawer.Screen name="profileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  const {msgs, language} = useContext(UserContext);
  const [genres, setGenres] = useState([] as Genre[]);

  useEffect(() => {
    genreService.findAll().then((grs) => setGenres(grs));
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={msgs.home}
        onPress={() =>
          props.navigation.navigate('bookScreen', {
            subGenre: undefined,
          })
        }
      />
      {genres.map((genre) => (
        <Accordion
          key={genre.nameEn}
          title={language === 'en' ? genre.nameEn : genre.nameAr}>
          {genre.subGenre.map((sub) => (
            <Item
              key={sub.nameEn}
              title={language === 'en' ? sub.nameEn : sub.nameAr}
              onPress={() => {
                props.navigation.navigate('bookScreen', {
                  subGenre: sub,
                });
              }}
            />
          ))}
        </Accordion>
      ))}
      <DrawerItem
        label={msgs.profile}
        onPress={() => props.navigation.navigate('profileScreen', {})}
      />
      <DrawerItem
        label={msgs.favourite}
        onPress={() =>
          props.navigation.navigate('bookScreen', {favourite: true})
        }
      />
    </DrawerContentScrollView>
  );
}
