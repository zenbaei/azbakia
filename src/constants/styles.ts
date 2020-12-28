import {StyleSheet} from 'react-native';
import {getAppTheme} from 'zenbaei-js-lib/theme';

export const styles = StyleSheet.create({
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
    color: getAppTheme().mediumEmphasis,
    textAlign: 'right',
  },
  title: {
    paddingVertical: 5,
    textAlign: 'center',
  },
  image: {height: 150, width: 150},
});
