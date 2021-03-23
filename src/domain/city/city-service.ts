import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {mongoRestApi} from '../../../app.config';
import {City} from './city';

class CityService extends MongoHttpService<City> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.cities);
  }
}

export const cityService = new CityService();
