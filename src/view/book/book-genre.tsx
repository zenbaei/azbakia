import {NavigationScreens} from 'constants/navigation-screens';
import React from 'react';
import {NavigationProps, Text} from 'zenbaei-js-lib/react';

export function BookGenreScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'bookGenreScreen'>) {
  return <Text text="Book Genere" />;
}
