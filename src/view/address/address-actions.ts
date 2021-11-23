import {Address} from 'zenbaei-js-lib/types/address';
import {userService} from 'domain/user/user-service';
import {countryService} from 'domain/country/country-service';
import {Country} from 'domain/country/country';
import {v1 as uuidv1} from 'uuid';

export const findCountry = (country: string): Promise<Country> => {
  return countryService.findOne('country', country);
};

export const updateDefaultAddress = async (
  addresses: Address[],
  id: string,
  clb: (updatedAdds: Address[]) => void,
) => {
  const updatedAdds = addresses.map((ad) => {
    console.debug(ad.id);
    ad.id === id ? (ad.default = true) : (ad.default = false);
    return ad;
  });
  const result = await userService.updateById(global.user._id, {
    $set: {addresses: updatedAdds},
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

export const updateAddress = async (
  modifiedAddressId: string,
  newAddress: Address,
  clb: (updated: boolean) => void,
) => {
  const usr = await userService.findOne('_id', global.user._id);
  const clonedAddresses = [...usr.addresses];
  clonedAddresses.splice(
    getIndex(usr.addresses, modifiedAddressId as string),
    1,
    newAddress,
  );
  userService
    .updateById(global.user._id, {$set: {addresses: clonedAddresses}})
    .then((mr) => (mr.modified === 1 ? clb(true) : clb(false)));
};

export const insertAddress = async (
  newAddress: Address,
  clb: (inserted: boolean) => void,
) => {
  const usr = await userService.findOne('_id', global.user._id);
  usr.addresses = usr.addresses ? usr.addresses : [];
  const clonedAddresses = [...usr.addresses];
  if (clonedAddresses && clonedAddresses.length === 0) {
    newAddress.default = true;
  }
  clonedAddresses.push(newAddress);
  userService
    .updateById(global.user._id, {
      $set: {addresses: clonedAddresses},
    })
    .then((mr) => (mr.modified === 1 ? clb(true) : clb(false)));
};

export const generateUUID = (): string => {
  return uuidv1();
};

export const getAddress = (addresses: Address[], id: string): Address => {
  return addresses.find((a) => a.id === id) as Address;
};

export const getIndex = (addresses: Address[], id: string): number => {
  return addresses.findIndex((d) => d.id === id);
};

export const getDefaultAddress = (addresses: Address[]): Address => {
  return addresses.find((a) => a.default) as Address;
};
