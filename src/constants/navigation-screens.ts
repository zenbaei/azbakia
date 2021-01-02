import {Book} from 'book/book';

export type NavigationScreens = {
  loginScreen: {};
  homeScreen: any;
  bookDetailsScreen: Book;
  bookGenreScreen: {};
  checkoutScreen: {};
  lookInsideBookScreen: {imageFolderName: string};
  drawerNavigator: any;
};
