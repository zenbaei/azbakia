import {SubGenre} from 'domain/genre/genre';
import {Cart} from 'domain/user/user';

export type NavigationScreens = {
  loginScreen: {};
  bookScreen: {subGenre: SubGenre; favourite?: boolean};
  bookDetailsScreen: {id: string};
  bookGenreScreen: {};
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
};
