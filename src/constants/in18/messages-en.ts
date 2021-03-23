import { any } from "prop-types";
import { string } from "yargs";

export const MessagesEn: Msg = {
  invalidUser: 'Wrong username or password',
  login: 'Login',
  home: 'Home',
  bookDetails: 'Book Details',
  bookGenre: 'Book Genre',
  description: 'Description',
  price: 'Price',
  checkout: 'Checkout',
  lookInside: 'Look inside',
  addedToFav: 'Added to favourite',
  removedFromFav: 'Removed from favourite',
  addToCart: 'Add to cart',
  addedToCart: 'Added to cart',
  removedFromCart: 'Removed from cart',
  removeFromCart: 'Remove from cart',
  newArrivals: 'New Arrivals',
  nuOfCopies: 'Number of copies',
  availableCopies: 'Available copies',
  total: 'tatal',
  emptyCart: 'Your cart is empty',
  cart: 'Cart',
  continue: 'Continue',
  delivery: 'Delivery',
  deliveryCharge: 'Delivery charge',
};

export type Msg = {[x:string] : string}