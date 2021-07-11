import React from 'react';
import {Button, NavigationProps} from 'zenbaei-js-lib/react';
import {NavigationScreens} from '../../src/constants/navigation-screens';
import {BookScreen} from '../../src/view/book/book-screen';
export const DrawerLike = ({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookScreen'>) => {
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
      <BookScreen navigation={navigation} route={route} />
    </>
  );
};
