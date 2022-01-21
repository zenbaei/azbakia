import {SubGenre} from 'domain/genre/genre';
import {Cart} from 'domain/user/cart';

export type NavigationScreens = {
  loginScreen: {};
  productScreen: {subGenre: SubGenre};
  productDetailsScreen: {_id: string; imagesUrl: string[]};
  favouriteScreen: {};
  cartScreen: {cart: Cart[]};
  productImagesScreen: {_id: string; imagesUrl: string[]};
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
