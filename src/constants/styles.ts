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
    image: {width: 150, resizeMode: 'contain', aspectRatio: 2 / 2},
    addToCartBtn: {
      marginTop: 5,
    },
    searchSeparator: {
      height: 1,
      width: '100%',
      backgroundColor: '#CED0CE',
    },
    searchInput: {
      width: '95%',
      borderWidth: 1,
      borderColor: theme.secondary,
      borderRadius: 25,
      alignSelf: 'center',
      color: theme.onBackground,
    },
    searchResult: {
      backgroundColor: 'white',
      position: 'absolute',
      width: '95%',
      zIndex: 1,
      alignSelf: 'center',
      marginTop: 5,
    },
    removeIconStyle: {alignSelf: 'flex-end', marginEnd: 30},
  });
