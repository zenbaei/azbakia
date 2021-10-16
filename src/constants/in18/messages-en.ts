import {MessagesInterface} from './messages-interface';

export const messagesEn: MessagesInterface = {
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
  quantity: 'Quantity',
  availableCopies: 'Available copies',
  stock: 'Stock',
  total: 'Total',
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
  inCart: 'In cart',
  sorryBookNotAvailable:
    'Sorry this book is no longer available, do you want to request a copy?',
  noBooksAvailable: 'No books available..',
  sorryInventoryChanged:
    'Sorry the inventory has been changed while you were online',
  noResultFound: 'No result found',
  amountUpdated: 'Amount updated',
  addressDeleted: 'Address deleted',
  addressCreated: 'Address created',
  addressUpdated: 'Address updated',
  defaultAddressUpdated: 'Default address updated',
  address: 'Address',
  street: 'Street',
  city: 'City',
  country: 'Country',
  area: 'Area',
  apartment: 'Apartment',
  building: 'Building',
  comment: 'Comment',
  defaultAddress: 'Default address',
  phoneNo: 'Mobile',
  additionalPhoneNo: 'Additional phone number',
  addAddress: 'Add address',
  chooseDeliveryAddress: 'Choose delivery address',
  createAddress: 'Create address',
  modifyAddress: 'Modify address',
  save: 'Save',
  update: 'Update',
  changePassword: 'Change password',
  manageAddress: 'Manage address',
  profile: 'Profile',
  pleaseAddAddress: 'Please add an address',
  noAddress: 'No address',
  addressMandatoryFields: 'Street, Apartment and Building cannot be empty!',
  charges: 'Charges',
  saveError: 'Problem saving!',
  expectedDeliveryDate: 'Expected delivery date',
  between: 'between',
  and: 'and',
  cardNumber: 'Card number',
  cod: 'Cash on delivery',
  credit: 'Credit card',
  paymentMethod: 'Payment method',
  cvv: 'cvv',
  deliveryDetails: 'Delivery details',
  change: 'Change',
  phoneAndAddressMandatory: 'You must have an address and phone number',
  modifyDeliveryInfo: 'Modify delivery info',
  invalidAdditionalPhoneNo: 'Additional phone number is invalid',
  invalidPhoneNo: 'Mobile number is invalid',
  mobile: 'Mobile',
  phoneNoManadatory: 'Mobile cannot be empty',
  phoneNoSaved: 'Phone number saved',
  passwordSaved: 'Password saved',
  favourite: 'Favourite',
  noFavBooks: 'No favourite books',
  emailExists: 'Email already exists',
  userCreated: 'User created',
  sendingEmailError: 'Problem sending activation email, we will retry again',
  wrongUsernameOrPassword: 'Wrong username or password',
  requestCopy: 'Request a copy',
  requestSaved: 'Request saved',
  logout: 'Logout',
  yes: 'Yes',
  no: 'No',
  orders: 'My Orders',
  orderDate: 'Order Date',
  orderRef: 'Order ref',
  cancel: 'Cancel',
  status: 'Status',
  cancelConfirmation: 'Are you sure you want to cancel your item?',
  cannotCancel: `Order can only be canceled during 'pending' or 'processing' status`,
  itemCanceled: 'Item canceled',
  noOrders: 'No orders yet..',
  getKeyAtRuntime: (key: string) => messagesEn[key] as string,
};
