import {mongoRestApi} from '../../app.config';
import {DbCollectionNames} from 'constants/db-collection-names';

import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {Book} from './book';

class BookService extends MongoHttpService<Book> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.books);
  }

  findByNewArrivals = (): Promise<Book[]> => {
    return this.findAll({
      newArrival: true,
    });
  };
}

export const bookService = new BookService();
