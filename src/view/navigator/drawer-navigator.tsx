import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext, useEffect, useState} from 'react';
import {ProductScreen} from '../product/product-screen';
import {Item, Accordion} from 'react-native-paper/src/components/List/List';
import {ProductDetailsScreen} from 'view/product/product-details-screen';
import {ProductImagesScreen} from 'view/product/product-images-screen';
import {CartScreen} from 'view/cart/cart-screen';
import {Genre} from 'domain/genre/genre';
import {genreService} from 'domain/genre/genre-service';
import {UserContext} from 'user-context';
import {AddressManagementScreen} from 'view/address/address-management-screen';
import {ProfileScreen} from 'view/profile/profile-screen';
import {AddressListScreen} from 'view/address/address-list-screen';
import {DeliveryScreen} from 'view/delivery/delivery-screen';
import {FavouriteScreen} from 'view/product/favourite-screen';
import {CommonActions} from '@react-navigation/routers';
import {OrderScreen} from 'view/order/order-screen';

const tab = ' ';
const Drawer = createDrawerNavigator<NavigationScreens>();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName={'productScreen'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="productScreen"
        component={ProductScreen}
        initialParams={{
          subGenre: undefined,
        }}
      />
      <Drawer.Screen
        name="productDetailsScreen"
        component={ProductDetailsScreen}
      />
      <Drawer.Screen
        name="productImagesScreen"
        component={ProductImagesScreen}
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
        labelStyle={styles.drawerItemLabel}
        label={msgs.home}
        onPress={() =>
          props.navigation.navigate('productScreen', {
            subGenre: undefined,
          })
        }
      />
      {genres.map((genre) =>
        genre?.subGenres && genre.subGenres.length > 0 ? (
          <Accordion
            titleStyle={styles.drawerItemLabel}
            key={genre.enName}
            title={language === 'en' ? genre.enName : genre.arName}>
            {genre.subGenres.map((sub) => (
              <Item
                rippleColor={theme.secondary}
                titleStyle={styles.drawerItemLabel}
                key={sub.enName}
                title={`${tab} ${language === 'en' ? sub.enName : sub.arName}`}
                onPress={() => {
                  props.navigation.navigate('productScreen', {
                    subGenre: sub,
                  });
                }}
              />
            ))}
          </Accordion>
        ) : (
          <DrawerItem
            key={genre._id}
            labelStyle={styles.drawerItemLabel}
            label={language === 'en' ? genre.enName : genre.arName}
            onPress={() =>
              props.navigation.navigate('productScreen', {
                subGenre: genre,
              })
            }
          />
        ),
      )}
      <DrawerItem
        labelStyle={styles.drawerItemLabel}
        label={msgs.orders}
        onPress={() => props.navigation.navigate('orderScreen', {})}
      />
      <DrawerItem
        labelStyle={styles.drawerItemLabel}
        label={msgs.favourite}
        onPress={() => props.navigation.navigate('favouriteScreen', {})}
      />
      <DrawerItem
        labelStyle={styles.drawerItemLabel}
        label={msgs.profile}
        onPress={() => props.navigation.navigate('profileScreen', {})}
      />
      <DrawerItem
        labelStyle={styles.drawerItemLabel}
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
