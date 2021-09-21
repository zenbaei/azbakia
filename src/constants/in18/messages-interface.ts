import {messagesEn} from 'constants/in18/messages-en';

export interface MessagesInterface {
  [key: string]: string | ((key: string) => string);
  invalidUser: string;
  login: string;
  home: string;
  bookDetails: string;
  bookGenre: string;
  description: string;
  price: string;
  checkout: string;
  lookInside: string;
  addedToFav: string;
  removedFromFav: string;
  addToCart: string;
  addedToCart: string;
  removedFromCart: string;
  removeFromCart: string;
  newArrivals: string;
  quantity: string;
  availableCopies: string;
  total: string;
  emptyCart: string;
  cart: string;
  continue: string;
  delivery: string;
  deliveryCharge: string;
  unexpectedError: string;
  register: string;
  forgetPassword: string;
  ok: string;
  activateAcc: string;
  welcome: string;
  activationEmailSubject: string;
  activationEmailBody: string;
  searchPlaceholder: string;
  inCart: string;
  sorryBookNotAvailable: string;
  noBooksAvailable: string;
  sorryInventoryChanged: string;
  noResultFound: string;
  street: string;
  phoneNo: string;
  additionalPhoneNo: string;
  apartment: string;
  building: string;
  city: string;
  country: string;
  area: string;
  address: string;
  comment: string;
  defaultAddress: string;
  addAddress: string;
  chooseDeliveryAddress: string;
  createAddress: string;
  modifyAddress: string;
  save: string;
  update: string;
  changePassword: string;
  manageAddress: string;
  profile: string;
  amountUpdated: string;
  addressDeleted: string;
  addressCreated: string;
  addressUpdated: string;
  defaultAddressUpdated: string;
  pleaseAddAddress: string;
  noAddress: string;
  addressMandatoryFields: string;
  charges: string;
  saveError: string;
  expectedDeliveryDate: string;
  between: string;
  paymentMethod: string;
  cod: string;
  credit: string;
  cardNumber: string;
  cvv: string;
  and: string;
  deliveryDetails: string;
  getKeyAtRuntime: (key: string) => string;
}

export const getMessages = (language: Language): MessagesInterface => {
  switch (language) {
    case 'en':
      return messagesEn;
    default:
      return messagesEn;
  }
};
