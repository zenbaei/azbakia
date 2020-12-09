import {httpServerAddress} from 'app.config';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {Book} from './book';

const mongoHttpService: MongoHttpService<Book> = new MongoHttpService(
  httpServerAddress,
  'books',
);

export const findAll = <T>(
  queryObject: object,
): Promise<Book[] | undefined> => {
  return mongoHttpService.getAll(queryObject);
};
