import {_id} from 'zenbaei-js-lib/types';

export class Config extends _id {
  key!: string;
  value!: any;
}

type ConfigKey = 'currencies' | 'mobileNoLength' | 'pageSize';
export type CountryCurrency = {country: string; currency: string};

const getConfigValue = (key: ConfigKey, configs: Config[]): Config =>
  configs.find((c) => c.key === key) as Config;

export const getCurrency = (country: string, configs: Config[]): string => {
  const values = getConfigValue('currencies', configs)
    .value as CountryCurrency[];
  const cr = values.find((c) => c.country === country) as CountryCurrency;
  return cr.currency;
};

export const getPageSize = (configs: Config[]): number => {
  const cfg = getConfigValue('pageSize', configs);
  return Number(cfg.value);
};

export const getMobileNoLength = (configs: Config[]): number => {
  const cfg = getConfigValue('mobileNoLength', configs);
  return Number(cfg.value);
};
