import {ServerUrls} from 'app.config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib';
import {User} from './user';

const mongoHttpService: MongoHttpService<User> = new MongoHttpService(
  ServerUrls.http,
  DbCollectionNames.users,
);
export const loginUser = async (
  id: string,
  password: string,
): Promise<User | undefined> => {
  const query: User = {email: id, password: password};
  const users: User[] = await mongoHttpService.getAll(query);
  return users.length === 1 ? users[0] : undefined;
};
