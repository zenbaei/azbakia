import {_id} from 'zenbaei-js-lib/types';

export class Product extends _id {
  name!: string;
  author!: string;
  genre!: string;
  newArrivals: boolean = true;
  date!: Date;
  price!: number;
  description!: string;
  language: Language = 'ar';
  inventory: number = 1;
  requests!: request[];
  uuid!: string;
}

export type request = {email: string; date: Date};
