import {httpServerAddress} from 'app.config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {Book} from './book';

export class BookService extends MongoHttpService<Book> {
  constructor() {
    super(httpServerAddress, DbCollectionNames.books);
  }
}
