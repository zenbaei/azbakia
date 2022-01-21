import {productCardWidth, productCardWidthBig} from 'constants/styles';
import {Product} from 'domain/product/product';
import React, {useContext, useEffect, useState} from 'react';
import {AlertButton, ViewStyle} from 'react-native';
import {Alert, Image, TouchableHighlight} from 'react-native';
import IconButton from 'react-native-paper/src/components/IconButton';
import {UserContext} from 'user-context';
import {
  addOrRmvFrmCart,
  updateFav,
  getIconColor,
  findProduct,
  getCartIconColor,
  isInCart,
  requestProduct,
  getMainImageUrl,
} from 'view/product/product-screen-actions';
import {Card, Fab, Text} from 'zenbaei-js-lib/react';
import {getFilePaths} from 'zenbaei-js-lib/utils';
import {IMAGE_DIR, SERVER_URL} from '../../app-config';

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
  centerCard = false,
}: {
  product: Product;
  onPressImg?: (imagesUrl: string[]) => void;
  updateDisplayedProduct: (product: Product) => void;
  showSnackBar: (msg: string) => void;
  cartScreen?: boolean;
  centerCard?: boolean;
}) => {
  const {cart, setCart, favs, setFavs, msgs, theme, styles, currency} =
    useContext(UserContext);
  const cartScreenVisibilty: ViewStyle = cartScreen
    ? styles.hidden
    : styles.visible;
  const [imageUrl, setImageUrl] = useState('');
  const [imagesUrl, setImagesUrl] = useState([] as string[]);

  useEffect(() => {
    /*
    if (imagesUrl.length === 0) {
      console.log(imageUrl);
      getFilePaths(`${IMAGE_DIR}/${product._id}`)
        .then((filesPath) => {
          setImagesUrl(filesPath.files);
          getMainImageUrl(filesPath).then(setImageUrl);
        })
        .catch(() => {});
    }*/
  }, [product, imagesUrl]);

  const _updateFav = async (productId: string) => {
    updateFav(productId, favs, (modifiedFavs, isAdded) => {
      setFavs(modifiedFavs);
      showSnackBar(isAdded ? msgs.addedToFav : msgs.removedFromFav);
    });
  };

  const _addOrRmvFrmCart = async (id: string, addOrRmv: 1 | -1) => {
    const bk = await findProduct(id);
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
      findProduct(id).then((prd) => {
        updateDisplayedproduct(prd);
      });
    });
  };

  const _requestproduct = (id: string) => {
    requestProduct(id).then(() => showSnackBar(msgs.requestSaved));
  };

  const alertBtns = (productId: string): AlertButton[] => {
    return [
      {text: msgs.yes, onPress: () => _requestproduct(productId)},
      {text: msgs.no},
    ];
  };

  return (
    <Card
      width={cartScreen ? productCardWidthBig : productCardWidth}
      style={centerCard ? styles.flexCenter : styles.flexStart}>
      <TouchableHighlight
        testID="touchable"
        key={product.name + 'toh'}
        onPress={() => {
          onPressImg === undefined ? () => {} : onPressImg(imagesUrl);
        }}>
        {imageUrl ? (
          <Image
            source={{
              uri: `${SERVER_URL}${imageUrl}`,
            }}
            style={styles.image}
          />
        ) : (
          <></>
        )}
      </TouchableHighlight>
      <Fab
        icon="heart-outline"
        style={{
          ...styles.fav,
          backgroundColor: getIconColor(product._id, favs, theme),
        }}
        onPress={() => _updateFav(product._id)}
      />
      <Text style={styles.title} text={product.name} color={theme.secondary} />
      <Text
        align="right"
        style={{...styles.bold, ...styles.price}}
        text={`${product.price} ${currency}`}
      />
      <Text
        visible={product.inventory !== undefined && product.inventory > 0}
        align="right"
        testID="copies"
        style={{...styles.bold, ...styles.price, ...cartScreenVisibilty}}
        text={`${msgs.stock}: ${product.inventory}`}
      />
      <IconButton
        testID={'removeFromCartBtn'}
        icon="cart-outline"
        color={isInCart(product._id, cart) ? theme.primary : theme.onBackground}
        style={[
          cartScreenVisibilty,
          styles.flexEnd,
          {backgroundColor: getCartIconColor(product._id, cart, theme)},
        ]}
        onPress={() =>
          _addOrRmvFrmCart(product._id, isInCart(product._id, cart) ? -1 : 1)
        }
      />
      <IconButton
        style={[styles.flexEnd, cartScreen ? styles.visible : styles.hidden]}
        icon={'delete'}
        color={theme.secondary}
        onPress={() => _addOrRmvFrmCart(product._id, -1)}
      />
    </Card>
  );
};
