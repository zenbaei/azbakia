import {Book} from 'book/book';

export type NavigationScreens = {
  loginScreen: {};
  bookScreen: {favBooks: string[]; booksInCart: string[]};
  bookDetailsScreen: Book;
  bookGenreScreen: {};
  checkoutScreen: {};
  lookInsideBookScreen: {imageFolderName: string};
  drawerNavigator: {favBooks: string[]; booksInCart: string[]};
};
