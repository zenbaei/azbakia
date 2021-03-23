import {Book} from 'domain/book/book';
import {Cart} from 'domain/user/user';

export type NavigationScreens = {
  loginScreen: {};
  bookScreen: {genre: string};
  bookDetailsScreen: Book;
  bookGenreScreen: {};
  cartScreen: {cart: Cart[]};
  lookInsideBookScreen: {imageFolderName: string};
  drawerNavigator: {};
  deliveryScreen: {};
  paymentScreen: {};
};
