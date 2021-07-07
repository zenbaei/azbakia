import {AppThemeInterface} from 'zenbaei-js-lib/constants';

export const unexpectedError = (navigation: any) => {
  navigation.navigate('unexpectedErrorScreen', {});
};
