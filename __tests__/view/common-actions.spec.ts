import {getFavIconColor, addRemoveFromFav} from '../../src/view/common-actions';

const userServiceMock = require('../../src/user/user-service');
const theme = require('zenbaei-js-lib/theme/app-theme');
const arr: string[] = ['islam', 'ali', 'hassan'];
global.user = {_id: 1};

const addToFavBookSpy = jest
  .spyOn(userServiceMock.userService, 'addToFavBook')
  .mockReturnValue({updated: 1});

jest
  .spyOn(theme, 'getAppTheme')
  .mockReturnValue({primary: 'white', secondary: 'black'});

test(`Giving array string is provided, When the first argument 
    exits in the array, Then it should return primary color`, () => {
  expect.assertions(1);
  const result = getFavIconColor('ali', arr);
  expect(result).toBe('white');
});

test(`Giving array string is provided, When the first argument is 
    not in the array, Then it should return secondary color`, () => {
  expect.assertions(1);
  const result = getFavIconColor('karim', arr);
  expect(result).toBe('black');
});

test(`Giving service is mocked and array is provided, When first argument exists in array, 
  Then it should remove it from the array and call the server with it`, async () => {
  expect.assertions(2);
  const result = await addRemoveFromFav('ali', arr);
  const modifiedArr = ['islam', 'hassan'];
  expect(addToFavBookSpy).toHaveBeenCalledWith(1, modifiedArr);
  expect(result).toEqual(modifiedArr);
});

test(`Giving service is mocked and array is provided, When first argument doest not exist in array, 
  Then it should add it to the array and call the service with it`, async () => {
  expect.assertions(2);
  const result = await addRemoveFromFav('mostafa', arr);
  expect(addToFavBookSpy).toHaveBeenCalledWith(1, arr.concat(['mostafa']));
  expect(result).toEqual(arr.concat(['mostafa']));
});

test(`Giving service is mocked to fail update and array is provided, When first argument doest not exist in array, 
  Then it should add it to the array and call the service with it
  but returns the original array without modification`, async () => {
  expect.assertions(2);
  const addToFavBookSpyNoUpd = jest
    .spyOn(userServiceMock.userService, 'addToFavBook')
    .mockReturnValue({updated: 0});
  const result = await addRemoveFromFav('mostafa', arr);
  expect(addToFavBookSpyNoUpd).toHaveBeenCalledWith(1, arr.concat(['mostafa']));
  expect(result).toEqual(arr);
});
