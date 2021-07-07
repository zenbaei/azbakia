import React from 'react';
import {Button, NavigationProps} from 'zenbaei-js-lib/react';
import {BookScreen} from '../../src/view/book/book-screen';
import {NavigationScreens} from '../../src/constants/navigation-screens';
export const BookScreenWrapper = ({
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
