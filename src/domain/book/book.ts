import { _id } from "zenbaei-js-lib/types";


export class Book extends _id {
  name!: string;
  author!: string;
  genre!: string;
  newArrivals: boolean = true;
  price!: number;
  imageFolderName!: string;
  description!: string;
  language: bookLanuguage = 'ar';
  availableCopies: number = 1;
}

export type bookLanuguage = 'ar' | 'en';
