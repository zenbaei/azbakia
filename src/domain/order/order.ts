import {_id} from 'zenbaei-js-lib/types';

export class Order extends _id {
  date!: string;
  deliveryDate!: DeliveryDate;
  item!: Item;
  email!: string;
}

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'canceled';
export type Item = {
  bookId: string;
  price: number;
  quantity: number;
  status: OrderStatus;
};
export type DeliveryDate = {from: string; to: string};
