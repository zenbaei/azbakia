import {mongoRestApi} from '../../app.config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {User} from './user';

const moduleName: string = 'user-service';

export class UserService extends MongoHttpService<User> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.users);
  }

  getUser = async (id: string, password: string): Promise<User | undefined> => {
    const query: User = {email: id, password: password};
    const users = await this.getByQuery(query);
    return users && users.length === 1 ? users[0] : undefined;
  };
  addToFavBook = async (books: string[]): Promise<void> => {
    const query = {favBooks: books};
  };
}
