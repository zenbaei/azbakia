import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {mongoRestApi} from '../../../app.config';
import {Country} from './country';

class CountryService extends MongoHttpService<Country> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.countries);
  }
}

export const countryService = new CountryService();
