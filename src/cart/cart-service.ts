import {mongoRestApi} from '../../app.config';
import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {Cart} from './cart';

class CartService extends MongoHttpService<Cart> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.cart);
  }

  isInCart = async (bookName: string): Promise<boolean> => {
    const bookInCart = await this.getByUnique('bookName', bookName);
    return bookInCart ? true : false;
  };

  addToCart = async (bookName: string, userEmail: string) => {
    const cart = new Cart(bookName, userEmail);
    this.save(cart);
  };

  getUserCart = async (email: string): Promise<Cart[] | undefined> => {
    return this.getByQuery({userEmail: email});
  };
}

export const cartService = new CartService();
