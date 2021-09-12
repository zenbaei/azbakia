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
  deliveryScreen: {};
  paymentScreen: {};
  unexpectedErrorScreen: {};
  registerScreen: {};
  forgetPasswordScreen: {};
  addressScreen: {addresses?: Address[]; index?: number};
  profileScreen: {};
};
