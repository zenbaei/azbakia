import {_id} from 'zenbaei-js-lib/types';

export class Book extends _id {
  name!: string;
  author!: string;
  genre!: string;
  newArrivals: boolean = true;
  price!: number;
  imgFolderName!: string;
  description!: string;
  language: Language = 'ar';
  inventory: number = 1;
  requests!: request[];
}

export type request = {email: string; date: Date};
