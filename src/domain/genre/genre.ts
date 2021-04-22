import {_id} from 'zenbaei-js-lib/types';

export class Genre extends _id {
  nameEn!: string;
  nameAr!: string;
  subGenre!: SubGenre[];
  getName(lang: Language): string {
    return lang === 'en' ? this.nameEn : this.nameAr;
  }
}

export type SubGenre = Pick<Genre, 'nameEn' | 'nameAr' | 'getName'>;
