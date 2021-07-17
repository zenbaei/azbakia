import {_id} from 'zenbaei-js-lib/types';

export class User extends _id {
  email!: string;
  password!: string;
  favs: string[] = [];
  cart: Cart[] = [];
  activated: boolean = false;
}

export type Cart = {
  bookId: string;
  requestedCopies: number;
};
