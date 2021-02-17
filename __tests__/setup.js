import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
const mock = require('react-native-svg-mock/mock'); // <-- side-effects!!!

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

/*
jest.mock('react-native-svg/lib/commonjs/ReactNativeSVG', () => mock);
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  isTesting: true,
  select: () => 'ios',
}));

jest.mock('react-native-paper/src/components/FAB/FAB');
*/
