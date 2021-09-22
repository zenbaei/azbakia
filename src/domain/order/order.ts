import {Cart} from 'domain/user/user';
import {_id} from 'zenbaei-js-lib/types';

export class Order extends _id {
  date!: string;
  expectedDeliveryDateFrom!: string;
  expectedDeliveryDateTo!: string;
  cart!: Cart[];
  userEmail!: string;
  status!: orderStatus;
}

export type orderStatus = 'pending' | 'processing' | 'delivered' | 'canceled';
