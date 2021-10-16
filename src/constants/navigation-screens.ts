import {SubGenre} from 'domain/genre/genre';
import {Cart} from 'domain/user/cart';

export type NavigationScreens = {
  loginScreen: {};
  bookScreen: {subGenre: SubGenre};
  bookDetailsScreen: {id: string};
  favouriteScreen: {};
  cartScreen: {cart: Cart[]};
  lookInsideBookScreen: {imageFolderName: string};
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
