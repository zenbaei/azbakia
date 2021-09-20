import {_id} from 'zenbaei-js-lib/types';

export class Country extends _id {
  country!: string;
  cities!: City[];
}

export type City = {city: string; districtsAndCharges: DistrictAndCharge[]};
export type DistrictAndCharge = {district: string; deliveryCharge: number};
