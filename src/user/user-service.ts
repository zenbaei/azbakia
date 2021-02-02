import {mongoRestApi} from '../../app.config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {User} from './user';

const moduleName: string = 'user-service';

class UserService extends MongoHttpService<User> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.users);
  }

  findByEmailAndPass = async (
    email: string,
    password: string,
  ): Promise<User | undefined> => {
    const query: object = {email: email, password: password};
    const users = await this.findAll(query);
    return users && users.length === 1 ? users[0] : undefined;
  };
  updateFavOrCart = (
    id: string,
    books: string[],
    attribute: favOrCart,
  ): Promise<{updated: number}> => {
    const object =
      attribute === 'fav' ? {$set: {fav: books}} : {$set: {cart: books}};
    const updateQuery = object;
    return this.updateById(id, updateQuery);
  };

  addToCart = (id: string, books: string[]): Promise<{updated: number}> => {
    const updateQuery = {$set: {booksInCart: books}};
    return this.updateById(id, updateQuery);
  };
}

export type favOrCart = 'fav' | 'cart';
export const userService = new UserService();
