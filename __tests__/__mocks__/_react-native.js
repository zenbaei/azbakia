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
