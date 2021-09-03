import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {SearchBar} from '../../src/view/search-bar';

const onBlurMock = jest.fn();
const onChangeTextMock = jest.fn();

test(`Given search bar has a blur effect, When simulating blur,
    Then the handler method should be called`, async () => {
  const {getByTestId} = render(
    <SearchBar
      onBlur={onBlurMock}
      onChangeText={onChangeTextMock}
      onSelectItem={() => {}}
      minLength={1}
    />,
  );
  const searchInput = getByTestId('searchInput');
  expect.assertions(2);
  await waitFor(async () => {
    await fireEvent.changeText(searchInput, 'hello');
    expect(onChangeTextMock).toBeCalledTimes(1);
    fireEvent(searchInput, 'blur');
    expect(onBlurMock).toBeCalledTimes(1);
  });
});
