import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

/*
jest.mock(Linking, () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
  };
});

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
