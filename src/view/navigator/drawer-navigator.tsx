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
import {FavouriteScreen} from 'view/book/favourite-screen';
import {CommonActions} from '@react-navigation/routers';
import {OrderScreen} from 'view/order/order-screen';

const tab = ' ';
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
      <Drawer.Screen name="orderScreen" component={OrderScreen} />
      <Drawer.Screen name="profileScreen" component={ProfileScreen} />
      <Drawer.Screen name="favouriteScreen" component={FavouriteScreen} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  const {msgs, language} = useContext(UserContext);
  const [genres, setGenres] = useState([] as Genre[]);
  const {theme, styles} = useContext(UserContext);

  useEffect(() => {
    genreService.findAll().then((grs) => setGenres(grs));
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        labelStyle={{color: theme.secondary, ...styles.drawerItemLabel}}
        label={msgs.home}
        onPress={() =>
          props.navigation.navigate('bookScreen', {
            subGenre: undefined,
          })
        }
      />
      {genres.map((genre) => (
        <Accordion
          titleStyle={{color: theme.secondary, ...styles.drawerItemLabel}}
          key={genre.enName}
          title={language === 'en' ? genre.enName : genre.arName}>
          {genre.subGenres.map((sub) => (
            <Item
              rippleColor={theme.secondary}
              titleStyle={styles.drawerItemLabel}
              key={sub.enName}
              title={`${tab} ${language === 'en' ? sub.enName : sub.arName}`}
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
        labelStyle={{color: theme.secondary, ...styles.drawerItemLabel}}
        label={msgs.orders}
        onPress={() => props.navigation.navigate('orderScreen', {})}
      />
      <DrawerItem
        labelStyle={{color: theme.secondary, ...styles.drawerItemLabel}}
        label={msgs.favourite}
        onPress={() => props.navigation.navigate('favouriteScreen', {})}
      />
      <DrawerItem
        labelStyle={{color: theme.secondary, ...styles.drawerItemLabel}}
        label={msgs.profile}
        onPress={() => props.navigation.navigate('profileScreen', {})}
      />
      <DrawerItem
        labelStyle={{color: theme.secondary, ...styles.drawerItemLabel}}
        label={msgs.logout}
        onPress={() => {
          global.token = '';
          props.navigation.dispatch(
            CommonActions.reset({index: 0, routes: [{name: 'loginScreen'}]}),
          );
        }}
      />
    </DrawerContentScrollView>
  );
}
