import {StyleSheet} from 'react-native';
import {AppThemeInterface} from 'zenbaei-js-lib/constants';

export const productCardWidth = '48%';
export const productCardWidthBig = '68%';

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
    image: {width: '100%', resizeMode: 'contain', aspectRatio: 2 / 2},
    addToCartBtn: {
      marginTop: 5,
    },

    viewRow: {width: '100%', flexDirection: 'row'},
    closeImgIcon: {
      position: 'absolute',
      backgroundColor: theme.secondary,
      alignSelf: 'flex-end',
      top: 20,
      right: 20,
      zIndex: 100,
    },
    lookInsideImgFrame: {
      borderRadius: 10,
      borderColor: theme.secondary,
      borderWidth: 2,
      margin: 5,
      padding: 5,
    },
    lookInsideImg: {
      height: '100%',
      resizeMode: 'stretch',
      aspectRatio: 1 / 2,
    },
    cartQty: {paddingBottom: 10},
    visible: {display: 'flex'},
    hidden: {display: 'none'},
    requestACopyBtn: {borderColor: 'black', marginBottom: 0},
    flexStart: {alignSelf: 'flex-start'},
    flexCenter: {alignSelf: 'center'},
    flexEnd: {alignSelf: 'flex-end'},
    drawerItemLabel: {fontSize: 14},
    loginLoading: {position: 'absolute', top: '45%', right: '50%'},
    widthAuto: {width: 'auto'},
    labelViewContainer: {width: '50%'},
    columnCenterChildren: {alignItems: 'center'},
    marginBottom: {marginBottom: 10},
  });
