import {_id} from 'zenbaei-js-lib/utils';

export class Book extends _id {
  constructor(
    public name: string,
    public author: string,
    public genre: string,
    public newArrivals: boolean,
    public price: number,
    public imageFolderName: string,
    public description: string,
    public bookLanguage: BookLanuguageType = 'ar',
  ) {
    super();
  }
}

export type BookLanuguageType = 'ar' | 'en' | 'fr';
