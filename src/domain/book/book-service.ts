import {APP_REST_API} from '../../app-config';
import {DbCollectionNames} from 'constants/db-collection-names';

import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {Book, request} from './book';
import {modificationResult, queryOptions} from 'zenbaei-js-lib/types';

class BookService extends MongoHttpService<Book> {
  constructor() {
    super(APP_REST_API, DbCollectionNames.books);
  }

  findByNewArrivals = (
    booksInCart: string[],
    skip: number = 0,
    limit: number = 0,
  ): Promise<Book[]> => {
    const book = {
      newArrivals: true,
      $or: [{inventory: {$gt: 0}}, {name: {$in: booksInCart}}],
    };
    return this.findAll(book, undefined, skip, limit);
  };

  findByGenre = (
    booksInCart: string[],
    genre: string,
    skip: number = 0,
    limit: number = 0,
  ): Promise<Book[]> => {
    const book: any = {
      $and: [
        {genre: genre},
        {$or: [{inventory: {$gt: 0}}, {name: {$in: booksInCart}}]},
      ],
    };
    return this.findAll(book, undefined, skip, limit);
  };

  findBySearchToken = (
    searchToken: string,
    projection?: queryOptions<Book>,
    skip: number = 0,
    limit: number = 0,
  ): Promise<Book[]> => {
    const qry = {
      name: {$regex: searchToken},
      inventory: {$gt: 0},
    };
    return this.findAll(qry, projection, skip, limit);
  };

  updateInventory = (
    id: string,
    inventory: number,
  ): Promise<modificationResult> => {
    const book: Book = {inventory: inventory} as Book;
    return this.updateById(id, {$set: book});
  };

  restoreInventory = async (id: string, quantity: number) => {
    const book: Book = await this.findOne('_id', id);
    book.inventory += quantity;
    this.updateInventory(id, book.inventory);
  };

  updateRequest = async (id: string, rqst: request) => {
    const bk = await bookService.findOne('_id', id);
    const req: request | undefined = bk.requests.find(
      (r) => r.email === global.user.email,
    );
    req ? {} : this.updateById(id, {$push: {requests: [rqst]}});
  };

  findAllByBookIds = async (bookIds: string[]): Promise<Book[]> => {
    return this.findAll({$in: bookIds}, undefined, undefined, undefined, true);
  };
}

export const bookService = new BookService();
