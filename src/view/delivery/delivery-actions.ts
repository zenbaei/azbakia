import {Order} from 'domain/order/order';
import {orderService} from 'domain/order/order-service';
import moment from 'moment';
import {CartBookVO} from 'view/cart/cart-book-vo';

const dateFormat = 'ddd MM MMM YYYY';

export const inspectDeliveryDate = (): DeliveryDateRange => {
  const now: Date = new Date();
  const from = new Date();
  const to = new Date();
  from.setDate(now.getDate() + 3);
  to.setDate(now.getDate() + 7);
  return {from: new Date(from), to: new Date(to)};
};

export const createOrder = async (
  cartVO: Promise<CartBookVO[]>,
  date: DeliveryDateRange,
): Promise<void> => {
  const orders: Order[] = (await cartVO).map((c) => {
    return {
      date: new Date().toDateString(),
      item: {
        bookId: c._id,
        quantity: c.quantity,
        price: c.price as number,
        status: 'pending',
      },
      deliveryDate: {
        from: date.from.toDateString(),
        to: date.to.toDateString(),
      },
      email: global.user.email,
    } as Order;
  });
  orders.forEach((o) => orderService.insert(o));
};

export type DeliveryDateRange = {from: Date; to: Date};

export const formatDate = (date: Date): string => {
  return moment(date).format(dateFormat);
};
