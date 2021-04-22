import {mongoRestApi} from '../../../app.config';
import {DbCollectionNames} from 'constants/db-collection-names';

import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {Book} from './book';
import {modificationResult} from 'zenbaei-js-lib/types';

class BookService extends MongoHttpService<Book> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.books);
  }

  findByNewArrivals = (
    skip: number = 0,
    limit: number = 0,
  ): Promise<Book[]> => {
    const book: any = {newArrivals: true, availableCopies: {$gt: 0}};
    return this.findAll(book, undefined, skip, limit);
  };

  findByGenre = (
    genre: string,
    skip: number = 0,
    limit: number = 0,
  ): Promise<Book[]> => {
    const book: any = {genre: genre, availableCopies: {$gt: 0}};
    return this.findAll(book, undefined, skip, limit);
  };

  updateAvailableCopies = (
    id: string,
    availableCopies: number,
  ): Promise<modificationResult> => {
    const book: Book = {availableCopies: availableCopies} as Book;
    return this.updateById(id, {$set: book});
  };
}

export const bookService = new BookService();
