import React from 'react';
import {Button, NavigationProps} from 'zenbaei-js-lib/react';
import {NavigationScreens} from '../../src/constants/navigation-screens';
export const DrawerMock = ({
  navigation,
}: NavigationProps<NavigationScreens, 'drawerNavigator'>) => {
  return (
    <>
      <Button
        testID="hadith"
        label="hadith"
        onPress={() =>
          navigation.navigate('bookScreen', {subGenre: {nameEn: 'hadith'}})
        }
      />
      <Button
        testID="fiqh"
        label="fiqh"
        onPress={() =>
          navigation.navigate('bookScreen', {subGenre: {nameEn: 'fiqh'}})
        }
      />
    </>
  );
};
