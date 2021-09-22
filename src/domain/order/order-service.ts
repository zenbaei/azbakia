import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {mongoRestApi} from '../../../app.config';
import {Order} from './order';

class OrderService extends MongoHttpService<Order> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.orders);
  }
}

export const orderService = new OrderService();
