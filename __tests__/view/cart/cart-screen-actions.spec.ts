import {CartBookVO} from '../../../src/view/cart/cart-book-vo';
import * as actions from '../../../src/view/cart/cart-screen-actions';

test(`Giving cart has some items, 
  When passing the cart array,
  Then it should sum its price`, () => {
  expect.assertions(1);
  const vos = [{price: 2}, {price: 3}, {price: 5}] as CartBookVO[];
  const result = actions.calculateSum(vos);
  expect(result).toBe(10);
});

test(`Given we need to turn a number into an array from that number length,
    When the number is 3,
    Then it should return an array of length 3 from 1 to 3`, () => {
  expect.assertions(2);
  const expectedResult = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
  ];
  const result = actions.flatenNumberToArray(3);
  expect(result.length).toBe(3);
  expect(result).toEqual(expectedResult);
});

test.todo(`test loadBookVos price calculation`);
