import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {APP_REST_API} from '../../../app-config';
import {Config} from './config';

class ConfigService extends MongoHttpService<Config> {
  constructor() {
    super(APP_REST_API, DbCollectionNames.config);
  }
}

export const configService = new ConfigService();
