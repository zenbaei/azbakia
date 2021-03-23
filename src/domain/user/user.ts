import { _id } from "zenbaei-js-lib/types";


export class User extends _id {
  email!: string;
  password!: string;
  favs: string[] = [];
  cart: Cart[] = [];
}

export type Cart = {
  bookId: string;
  nuOfCopies: number;
};
