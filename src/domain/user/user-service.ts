import {APP_API, IP_DATA_API} from '../../../app-config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService, get} from 'zenbaei-js-lib/utils';
import {User} from './user';
import {modificationResult} from 'zenbaei-js-lib/types';
import {Cart} from './cart';

class UserService extends MongoHttpService<User> {
  constructor() {
    super(APP_API, DbCollectionNames.users);
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

  registers = async (email: string, password: string): Promise<any> => {
    const data = await (await get(IP_DATA_API)).json();
    return this.register({
      email: email,
      password: password,
      country: data.country_name,
      activated: false,
    } as User);
  };
}

export const userService = new UserService();
