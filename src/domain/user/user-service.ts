import {APP_REST_API} from '../../app-config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {User} from './user';
import {modificationResult} from 'zenbaei-js-lib/types';
import {Cart} from './cart';

class UserService extends MongoHttpService<User> {
  constructor() {
    super(APP_REST_API, DbCollectionNames.users);
  }

  logins = async (email: string, password: string): Promise<User> => {
    const user: User = {email: email, password: password} as User;
    return this.login(user);
  };

  addToFav = (id: string, bookId: string): Promise<modificationResult> => {
    const favs: any = {favs: bookId};
    return this.updateById(id, {$push: favs});
  };

  removeFromFav = (id: string, bookId: string): Promise<modificationResult> => {
    const favs: any = {favs: bookId};
    return this.updateById(id, {$pull: favs});
  };

  updateCart = (id: string, cart: Cart[]): Promise<modificationResult> => {
    return this.updateById(id, {$set: {cart: cart}});
  };

  deleteCart = (id: string): Promise<modificationResult> => {
    return this.updateCart(id, []);
  };
}

export const userService = new UserService();
