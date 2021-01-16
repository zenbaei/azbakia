import {_id} from 'zenbaei-js-lib/utils';

export class User extends _id {
  email!: string;
  password!: string;
  favBooks!: string[];
  booksInCart!: string[];
}
