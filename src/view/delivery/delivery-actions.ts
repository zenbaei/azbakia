import {Item, Order} from 'domain/order/order';
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
  deliveryDate: DeliveryDateRange,
  clb: () => void,
): Promise<void> => {
  const items: Item[] = (await cartVO).map((c) => ({
    bookId: c._id,
    quantity: c.quantity,
    price: c.price,
    status: 'pending',
  }));
  const order: Order = {
    deliveryDate: {
      from: deliveryDate.from,
      to: deliveryDate.to,
    },
    email: global.user.email,
    date: new Date(),
    items: items,
  } as Order;
  orderService.insert(order).then((r) => (r.modified > 0 ? clb() : {}));
};

export type DeliveryDateRange = {from: Date; to: Date};

export const formatDate = (date: Date): string => {
  return moment(date).format(dateFormat);
};
