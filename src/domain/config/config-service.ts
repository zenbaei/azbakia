import {DbCollectionNames} from 'constants/db-collection-names';
import {MongoHttpService} from 'zenbaei-js-lib/utils';
import {mongoRestApi} from '../../../app.config';
import {Config} from './config';

class ConfigService extends MongoHttpService<Config> {
  constructor() {
    super(mongoRestApi, DbCollectionNames.config);
  }
}

export const configService = new ConfigService();
