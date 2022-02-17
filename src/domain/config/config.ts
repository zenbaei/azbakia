import {_id} from 'zenbaei-js-lib/types';

export class Config extends _id {
  key!: string;
  value!: any;
}

type ConfigKey = 'MOBILE_NO_LENGTH' | 'PAGE_SIZE' | 'SHIPMENT_COLLECTION_DAYS';

const getConfigValue = (key: ConfigKey, configs: Config[]): Config =>
  configs.find((c) => c.key === key) as Config;

export const getPageSize = (configs: Config[]): number => {
  const cfg = getConfigValue('PAGE_SIZE', configs);
  return Number(cfg.value);
};

export const getMobileNoLength = (configs: Config[]): number => {
  const cfg = getConfigValue('MOBILE_NO_LENGTH', configs);
  return Number(cfg.value);
};

export const getShipmentCollectionDays = (configs: Config[]): number => {
  const cfg = getConfigValue('SHIPMENT_COLLECTION_DAYS', configs);
  return Number(cfg.value);
};
