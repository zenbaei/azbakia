/*
import * as ReactNative from 'react-native';

export const Platform = {
  ...ReactNative.Platform,
  OS: 'android',
  Version: 123,
  isTesting: true,
  select: (objs) => objs['android'],
};

export default Object.setPrototypeOf(
  {
    Platform,
  },
  ReactNative,
);
*/

const rn = require('react-native');
jest.mock('Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
  };
});
module.exports = rn;
