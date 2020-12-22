import {Book} from 'book/book';
import {User} from 'user/user';

export type NavigationScreens = {
  loginScreen: {};
  homeScreen: User;
  bookDetailsScreen: Book;
  bookGenreScreen: {};
  drawerNavigation: any;
};
