import {AppThemeInterface} from 'zenbaei-js-lib/constants';

export const getIconColor = (
  id: string,
  ids: string[],
  theme: AppThemeInterface,
): string => {
  if (ids.find((val) => val === id)) {
    return theme.primary;
  }
  return theme.secondary;
};

export const unexpectedError = (navigation: any) => {
  navigation.navigate('unexpectedErrorScreen', {});
};
