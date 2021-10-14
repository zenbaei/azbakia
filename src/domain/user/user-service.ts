import {mongoRestApi} from '../../../app.config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {User} from './user';
import {modificationResult} from 'zenbaei-js-lib/types';
import {Cart} from './cart';

class UserService extends MongoHttpService<User> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.users);
  }

  findByEmailAndPass = async (
    email: string,
    password: string,
  ): Promise<User | undefined> => {
    const user: User = {email: email, password: password} as User;
    const users = await this.findAll(user);
    return users && users.length === 1 ? users[0] : undefined;
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
}

export const userService = new UserService();
