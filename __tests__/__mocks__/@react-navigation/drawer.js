jest.mock('@react-navigation/drawer', () => {
  return {
    addEventListener: jest.fn(),
    createDrawerNavigator: jest.fn(),
  };
});
