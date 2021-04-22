import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {mongoRestApi} from '../../../app.config';
import {Genre} from './genre';

class GenreService extends MongoHttpService<Genre> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.genres);
  }
}

export const genreService = new GenreService();
