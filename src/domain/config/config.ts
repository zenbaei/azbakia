import {_id} from 'zenbaei-js-lib/types';
import {Logger} from 'zenbaei-js-lib/utils';

export class Config extends _id {
  key!: string;
  value!: any;
}

type ConfigKey = 'MOBILE_NO_LENGTH' | 'PAGE_SIZE' | 'PICKUP_DAYS';

const getConfigValue = (key: ConfigKey, configs: Config[]): Config => {
  Logger.debug('Config', 'getConfigValue', `Key: ${key}`);
  return configs.find((c) => c.key === key) as Config;
};

export const getPageSize = (configs: Config[]): number => {
  const cfg = getConfigValue('PAGE_SIZE', configs);
  return Number(cfg.value);
};

export const getMobileNoLength = (configs: Config[]): number => {
  const cfg = getConfigValue('MOBILE_NO_LENGTH', configs);
  return Number(cfg.value);
};

export const getPickupDays = (configs: Config[]): number => {
  const cfg = getConfigValue('PICKUP_DAYS', configs);
  return Number(cfg.value);
};
