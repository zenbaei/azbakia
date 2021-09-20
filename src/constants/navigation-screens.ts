import {Book} from 'domain/book/book';
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
  addressListScreen: {};
  deliveryScreen: {cartTotalPrice: number};
  addressManagementScreen: {
    index?: number;
    status: 'Create' | 'Modify';
  };
  profileScreen: {};
};
