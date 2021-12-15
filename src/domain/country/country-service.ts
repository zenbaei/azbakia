import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {APP_REST_API} from '../../../app-config';
import {Country} from './country';

class CountryService extends MongoHttpService<Country> {
  constructor() {
    super(APP_REST_API, DbCollectionNames.countries);
  }
}

export const countryService = new CountryService();
