import {StyleSheet} from 'react-native';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';

export const getStyles = (theme: AppThemeInterface) =>
  StyleSheet.create({
    fav: {
      right: 25,
      top: 15,
    },
    cart: {
      right: 25,
      top: 115,
    },
    wide: {
      width: '100%',
    },
    bold: {
      fontWeight: 'bold',
    },
    price: {
      color: theme.mediumEmphasis,
      textAlign: 'right',
    },
    title: {
      paddingVertical: 5,
      textAlign: 'center',
    },
    image: {height: 150, width: 150, resizeMode: 'contain', aspectRatio: 2 / 2},
    addToCartBtn: {
      marginTop: 5,
    },
  });
