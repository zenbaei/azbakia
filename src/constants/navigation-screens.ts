import {Book} from 'book/book';

export type NavigationScreens = {
  loginScreen: {};
  bookScreen: {fav: string[]; cart: string[]};
  bookDetailsScreen: Book;
  bookGenreScreen: {};
  checkoutScreen: {};
  lookInsideBookScreen: {imageFolderName: string};
  drawerNavigator: {fav: string[]; cart: string[]};
};
