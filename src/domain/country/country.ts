import {_id} from 'zenbaei-js-lib/types';

export class Country extends _id {
  country!: string;
  cities!: City[];
  currency!: string;
}

export type City = {city: string; districtsDetails: DistrictDetails[]};
export type DistrictDetails = {
  district: string;
  deliveryCharge: number;
  deliveryDays: number;
};
