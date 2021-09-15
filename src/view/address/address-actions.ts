import {Address} from 'domain/address';
import {userService} from 'domain/user/user-service';
import {City} from 'domain/city/city';
import {cityService} from 'domain/city/city-service';

export const loadCities = (): Promise<City[]> => {
  return cityService.findAll();
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
