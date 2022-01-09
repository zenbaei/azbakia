import {_id} from 'zenbaei-js-lib/types';

export class Genre extends _id {
  enName!: string;
  arName!: string;
  subGenres!: SubGenre[];
  getName(lang: Language): string {
    return lang === 'en' ? this.enName : this.arName;
  }
}

export type SubGenre = Pick<Genre, 'enName' | 'arName' | 'getName'>;
