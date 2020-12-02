import {httpServerAddress} from 'app.config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib';
import {User} from './user';

const moduleName: string = 'user-service';

const mongoHttpService: MongoHttpService<User> = new MongoHttpService(
  httpServerAddress,
  DbCollectionNames.users,
);
export const getUser = async (
  id: string,
  password: string,
): Promise<User | undefined> => {
  const query: User = {email: id, password: password};
  const users = await mongoHttpService.getAll(query);
  return users.length === 1 ? users[0] : undefined;
};
