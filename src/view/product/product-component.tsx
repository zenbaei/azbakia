import {Product} from 'domain/product/product';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, AlertButton, View, ViewStyle} from 'react-native';
import {Alert, Image, TouchableHighlight} from 'react-native';
import IconButton from 'react-native-paper/src/components/IconButton';
import {UserContext} from 'user-context';
import {
  addOrRmvFrmCart,
  updateFav,
  getIconColor,
  findProduct,
  isInCart,
  requestProduct,
} from 'view/product/product-screen-actions';
import {Card, Fab, Text} from 'zenbaei-js-lib/react';
import {getMainImage, Logger} from 'zenbaei-js-lib/utils';
import {IMAGE_DIR} from '../../app-config';

/**
 *
 * @param updateDisplayedproduct - Replaces displayed product with the most recent
 * from db after update or in case of stale data.
 */
export const ProductComponent = ({
  product,
  onPressImg,
  updateDisplayedProduct: updateDisplayedproduct,
  showSnackBar,
  cartScreen = false,
}: {
  product: Product;
  onPressImg?: () => void;
  updateDisplayedProduct: (product: Product) => void;
  showSnackBar: (msg: string) => void;
  cartScreen?: boolean;
  centerCard?: boolean;
  isProductScreen?: boolean;
}) => {
  const {cart, setCart, favs, setFavs, msgs, theme, styles, currency} =
    useContext(UserContext);
  const cartScreenVisibilty: ViewStyle = cartScreen
    ? styles.hidden
    : styles.visible;
  const [imageBase64, setImageBase64] = useState(
    undefined as string | undefined,
  );
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    getMainImage(`${IMAGE_DIR}/${product.uuid}`).then((base) => {
      setImageBase64(base as string);
    });
  }, [product]);

  const _updateFav = async (productId: string) => {
    updateFav(productId, favs, (modifiedFavs, isAdded) => {
      setFavs(modifiedFavs);
      showSnackBar(isAdded ? msgs.addedToFav : msgs.removedFromFav);
    });
  };

  const _addOrRmvFrmCart = async (_id: string, addOrRmv: 1 | -1) => {
    const bk = await findProduct(_id);
    if (addOrRmv === 1 && bk.inventory < 1) {
      // stale data
      Alert.alert('', msgs.sorryBookNotAvailable, alertBtns(bk._id));
      updateDisplayedproduct(bk);
      return;
    }
    addOrRmvFrmCart(bk, cart, (modifiedCart) => {
      setCart(modifiedCart);
      addOrRmv === 1
        ? showSnackBar(msgs.addedToCart)
        : showSnackBar(msgs.removedFromCart);
      findProduct(_id).then((prd) => {
        updateDisplayedproduct(prd);
      });
    });
  };

  const _requestproduct = (_id: string) => {
    requestProduct(_id).then(() => showSnackBar(msgs.requestSaved));
  };

  const alertBtns = (productId: string): AlertButton[] => {
    return [
      {text: msgs.yes, onPress: () => _requestproduct(productId)},
      {text: msgs.no},
    ];
  };

  return (
    <Card width="100%" direction="row">
      <ActivityIndicator
        style={styles.centerLoading}
        animating={loadingImage}
        color={theme.primary}
      />
      <View
        style={{
          width: '50%',
          alignSelf: 'flex-start',
          borderWidth: 1,
          borderColor: theme.primary,
        }}>
        <TouchableHighlight
          testID="touchable"
          key={product.name + 'toh'}
          onPress={() => {
            onPressImg === undefined || !imageBase64 ? () => {} : onPressImg();
          }}>
          <Image
            onLoadStart={() => setLoadingImage(true)}
            onLoadEnd={() => setLoadingImage(false)}
            source={
              imageBase64
                ? {
                    uri: `data:image/png;base64,${imageBase64}`,
                  }
                : require('../../resources/images/no-image.png')
            }
            style={{...styles.image}}
          />
        </TouchableHighlight>
      </View>
      <View
        style={{
          height: '100%',
          width: '50%',
        }}>
        <View style={{flex: 1}}>
          <Text text={product.name} bold />
        </View>
        <View style={{flex: 1}}>
          <Text
            align="right"
            style={styles.price}
            bold
            text={`${product.price} ${currency}`}
          />
          <Text
            visible={product.inventory !== undefined && product.inventory > 0}
            align="right"
            testID="copies"
            bold
            style={{...styles.price, ...cartScreenVisibilty}}
            text={`${msgs.stock}: ${product.inventory}`}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="heart-outline"
            color={getIconColor(product._id, favs, theme)}
            style={{
              alignSelf: 'flex-end',
              backgroundColor: theme.secondary,
            }}
            onPress={() => _updateFav(product._id)}
          />
          <IconButton
            testID={'removeFromCartBtn'}
            icon="cart-outline"
            color={getIconColor(
              product._id,
              cart.products.map((p) => p.productId),
              theme,
            )}
            style={[
              cartScreenVisibilty,
              styles.flexEnd,
              {
                backgroundColor: theme.secondary,
              },
            ]}
            onPress={() =>
              _addOrRmvFrmCart(
                product._id,
                isInCart(product._id, cart.products) ? -1 : 1,
              )
            }
          />
          <IconButton
            style={[
              styles.flexEnd,
              cartScreen ? styles.visible : styles.hidden,
            ]}
            icon={'delete'}
            color={theme.primary}
            onPress={() => _addOrRmvFrmCart(product._id, -1)}
          />
        </View>
      </View>
    </Card>
  );
};
