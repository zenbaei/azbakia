import {City} from 'domain/city/city';
import {cityService} from 'domain/city/city-service';

export const loadCities = (): Promise<City[]> => {
  return cityService.findAll();
};
