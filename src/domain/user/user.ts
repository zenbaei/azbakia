import {_id, Address} from 'zenbaei-js-lib/types';
import {Cart} from './cart';

export class User extends _id {
  email!: string;
  password!: string;
  favs: string[] = [];
  cart: Cart[] = [];
  activated: boolean = false;
  addresses!: Address[];
  phoneNo!: string;
  additionalPhoneNo!: string;
  country!: string;
  token!: string;
}
