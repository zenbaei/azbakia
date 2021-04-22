import {MessagesInterface} from './messages-interface';

export const MessagesEn: MessagesInterface = {
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
  unexpectedError: 'Unexpected error',
  register: 'Register',
  forgetPassword: 'Forget Password',
  ok: 'Ok',
  activateAcc: 'Please check your email to activate your account',
  welcome: 'Welcome',
  activationEmailBody:
    'Please activate your account by pressing on the following link:',
  activationEmailSubject: 'Activate your account on azbakia',
  searchPlaceholder: '..Enter book name',
  getKeyAtRuntime: (key: string) => MessagesEn[key] as string,
};
