import {APP_REST_API} from '../../app-config';
import {DbCollectionNames} from 'constants/db-collection-names';

import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {Product, request} from './product';
import {modificationResult, queryOptions} from 'zenbaei-js-lib/types';
import moment from 'moment';

class ProductService extends MongoHttpService<Product> {
  constructor() {
    super(APP_REST_API, DbCollectionNames.products);
  }

  findByNewArrivals = (
    productsInCart: string[],
    skip: number = 0,
    limit: number = 0,
  ): Promise<Product[]> => {
    const book = {
      newArrivals: true,
      $or: [{inventory: {$gt: 0}}, {name: {$in: productsInCart}}],
    };
    return this.findAll(book, undefined, skip, limit);
  };

  findLatestProducts = (limit: number = 0): Promise<Product[]> => {
    const filter: any = {
      $and: [
        {inventory: {$gt: 0}},
        {date: {$gt: moment(Date.now()).subtract(7, 'days')}},
      ],
    };
    return this.findAll(filter, undefined, 0, limit);
  };

  findLastNProducts = (limit: number): Promise<Product[]> => {
    const filter = {inventory: {$gt: 0}};
    const options: queryOptions<Product> = {sort: {date: -1}};
    return this.findAll(filter, options, 0, limit);
  };

  /*
  findByGenre = (
    productsInCart: string[],
    genre: string,
    skip: number = 0,
    limit: number = 0,
  ): Promise<Product[]> => {
    const book: any = {
      $and: [
        {genre: genre},
        {$or: [{inventory: {$gt: 0}}, {name: {$in: productsInCart}}]},
      ],
    };
    return this.findAll(book, undefined, skip, limit);
  };
*/

  findByGenre = (
    genre: string,
    skip: number = 0,
    limit: number = 0,
  ): Promise<Product[]> => {
    const filter: any = {
      $and: [{genre: genre}, {inventory: {$gt: 0}}],
    };
    return this.findAll(filter, undefined, skip, limit);
  };

  findBySearchToken = (
    searchToken: string,
    projection?: queryOptions<Product>,
    skip: number = 0,
    limit: number = 0,
  ): Promise<Product[]> => {
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
    const product: Product = {inventory: inventory} as Product;
    return this.updateById(id, {$set: product});
  };

  restoreInventory = async (id: string, quantity: number) => {
    const product: Product = await this.findOne('_id', id);
    product.inventory += quantity;
    this.updateInventory(id, product.inventory);
  };

  updateRequest = async (id: string, rqst: request) => {
    const bk = await productService.findOne('_id', id);
    const req: request | undefined = bk.requests.find(
      (r) => r.email === global.user.email,
    );
    req ? {} : this.updateById(id, {$push: {requests: [rqst]}});
  };

  findAllByProductIds = async (productIds: string[]): Promise<Product[]> => {
    return this.findAll(
      {$in: productIds},
      undefined,
      undefined,
      undefined,
      true,
    );
  };
}

export const productService = new ProductService();
