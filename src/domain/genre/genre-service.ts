import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {APP_REST_API} from '../../../app-config';
import {Genre} from './genre';

class GenreService extends MongoHttpService<Genre> {
  constructor() {
    super(APP_REST_API, DbCollectionNames.genres);
  }
}

export const genreService = new GenreService();
