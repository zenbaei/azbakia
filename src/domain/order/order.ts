import {_id} from 'zenbaei-js-lib/types';

export class Order extends _id {
  date!: Date;
  deliveryDate!: DeliveryDate;
  items!: Item[];
  email!: string;
}

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'canceled';
export type Item = {
  productId: string;
  price: number;
  quantity: number;
  status: OrderStatus;
};
export type DeliveryDate = {from: Date; to: Date};
