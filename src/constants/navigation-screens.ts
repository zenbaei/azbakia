import {Book} from 'domain/book/book';
import {Address} from 'domain/address';
import {SubGenre} from 'domain/genre/genre';
import {Cart} from 'domain/user/user';

export type NavigationScreens = {
  loginScreen: {};
  bookScreen: {subGenre: SubGenre};
  bookDetailsScreen: Book;
  bookGenreScreen: {};
  cartScreen: {cart: Cart[]};
  lookInsideBookScreen: {imageFolderName: string};
  drawerNavigator: {};
  paymentScreen: {};
  unexpectedErrorScreen: {};
  registerScreen: {};
  forgetPasswordScreen: {};
  addressListScreen: {isDeliveryScreen: boolean; title: string};
  addressManagementScreen: {addresses?: Address[]; index?: number};
  profileScreen: {};
};
