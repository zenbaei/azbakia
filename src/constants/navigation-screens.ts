import {SubGenre} from 'domain/genre/genre';
import {Product} from 'domain/product/product';
import {Cart} from 'domain/user/cart';

export type NavigationScreens = {
  loginScreen: {};
  productScreen: {subGenre: SubGenre};
  productDetailsScreen: {product: Product};
  favouriteScreen: {};
  cartScreen: {cart: Cart[]};
  drawerNavigator: {};
  paymentScreen: {};
  unexpectedErrorScreen: {};
  registerScreen: {};
  forgetPasswordScreen: {};
  addressListScreen: {};
  deliveryScreen: {cartTotalPrice: number};
  addressManagementScreen: {
    id?: string;
  };
  profileScreen: {};
  orderScreen: {};
};
