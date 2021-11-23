import {DbCollectionNames} from 'constants/db-collection-names';
import {modificationResult} from 'zenbaei-js-lib/types';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {APP_API} from '../../../app-config';
import {Item, Order} from './order';

class OrderService extends MongoHttpService<Order> {
  constructor() {
    super(APP_API, DbCollectionNames.orders);
  }
  cancelItem = async (
    id: string,
    bookId: string,
  ): Promise<modificationResult> => {
    const order = await this.findOne('_id', id);
    const item = order.items.find((i) => i.bookId === bookId) as Item;
    item.status = 'canceled';
    return this.updateById(id, {$set: {items: order.items}});
  };
}

export const orderService = new OrderService();
