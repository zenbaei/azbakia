import {SubGenre} from 'domain/genre/genre';
import {Cart} from 'domain/user/cart';

export type NavigationScreens = {
  loginScreen: {};
  productScreen: {subGenre: SubGenre};
  productDetailsScreen: {id: string};
  favouriteScreen: {};
  cartScreen: {cart: Cart[]};
  lookInsideProductScreen: {imageFolderName: string};
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
