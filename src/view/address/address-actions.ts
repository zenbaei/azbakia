import {Address} from 'zenbaei-js-lib/types/address';
import {userService} from 'domain/user/user-service';
import {countryService} from 'domain/country/country-service';
import {Country} from 'domain/country/country';

export const findCountry = (country: string): Promise<Country> => {
  return countryService.findOne('country', country);
};

export const updateDefaultAddress = async (
  addresses: Address[],
  address: Address,
  clb: (updatedAdds: Address[]) => void,
) => {
  const updatedAdds = addresses.map((ad) => {
    ad.street === address.street ? (ad.default = true) : (ad.default = false);
    return ad;
  });
  const result = await userService.updateById(global.user._id, {
    $set: {address: updatedAdds},
  });
  result.modified === 1 ? clb(updatedAdds) : addresses;
};

export const getDistrictCharge = async (address: Address): Promise<number> => {
  const country = await countryService.findOne('country', global.user.country);
  const city = country.cities.find((c) => c.city === address.city);
  const districtAndCharge = city?.districtsAndCharges.find(
    (d) => d.district === address.district,
  );
  return districtAndCharge?.deliveryCharge as number;
};
