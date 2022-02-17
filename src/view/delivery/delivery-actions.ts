import {Item, Order} from 'domain/order/order';
import {orderService} from 'domain/order/order-service';
import moment from 'moment';
import {CartProductVO} from 'view/cart/cart-product-vo';

const dateFormat = 'ddd DD MMM YYYY';

export const inspectDeliveryDate = (
  pickupDays: number,
  deliveryDays: number,
): DeliveryDateRange => {
  const from: number = pickupDays + 1;
  const to: number = pickupDays + deliveryDays;
  return {
    from: moment(moment.now()).add(from, 'days').toDate(),
    to: moment(moment.now()).add(to, 'days').toDate(),
  };
};

export const createOrder = async (
  cartVO: Promise<CartProductVO[]>,
  deliveryDate: DeliveryDateRange,
  clb: () => void,
): Promise<void> => {
  const items: Item[] = (await cartVO).map((c) => ({
    productId: c._id,
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
