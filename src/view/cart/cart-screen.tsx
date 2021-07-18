import {NavigationScreens} from 'constants/navigation-screens';
import {getStyles} from 'constants/styles';
import React, {useCallback, useContext, useState} from 'react';
import {Image} from 'react-native';
import {
  Button,
  Card,
  Row,
  Grid,
  NavigationProps,
  Text,
  Picker,
} from 'zenbaei-js-lib/react';
import {imagesNames, staticFileUrl} from '../../../app.config';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {FlatList} from 'react-native-gesture-handler';
import {
  calculateSum,
  loadCartBooksVOs,
  flatenNumberToArray,
  updateRequestedCopies,
} from './cart-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/core';
import {CartBookVO} from './cart-book-vo';
import {addOrRmvFrmCart, findBook} from 'view/book/book-screen-actions';

export function CartScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'cartScreen'>) {
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const {cart, setCart, msgs, theme} = useContext(UserContext);
  const [cartBooksVOs, setCartBooksVOs] = useState([] as CartBookVO[]);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.cart);
      global.setDisplayCartBtn('none');
      loadCartBooksVOs(cart).then((vo) => setCartBooksVOs(vo));
    }, [cart, msgs.cart]),
  );
  /*
  const _removeFromCart = async (cartBookVO: CartBookVO) => {
    removeFromCart(
      cartBookVO._id,
      cartBookVO.availableCopies,
      cart,
      (modifiedCart) => {
        setCart(modifiedCart);
        setSnackBarMsg(msgs.removedFromCart);
        setSnackBarVisible(true);
      },
    );
  };
*/
  const _updateRequestedCopies = async (
    bookId: string,
    requestedCopies: number,
  ) => {
    const book = await findBook(bookId);
    if (book.inventory < requestedCopies) {
      //todo: update listed book inventory
      return;
    }
    if (requestedCopies === 0) {
      addOrRmvFrmCart(book, cart, -1, (crt) => setCart(crt));
      return;
    }
    updateRequestedCopies(book, requestedCopies, (crt) => setCart(crt));
  };

  return (
    <Grid>
      <Row>
        <FlatList
          data={cartBooksVOs}
          numColumns={1}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
            return (
              <Card key={item.name}>
                <Image
                  source={{
                    uri: `${staticFileUrl}/${item.imageFolderName}/${imagesNames[0]}`,
                  }}
                  style={styles.image}
                />
                <Text text={item.name} />
                <Text text={item.price} />
                <Text
                  style={{...styles.bold, ...styles.price}}
                  text={`${msgs.nuOfCopies}: ${item.requestedCopies}`}
                />
                <Picker
                  data={flatenNumberToArray(item.inventory)}
                  selectedValue={String(item.requestedCopies)}
                  key={item._id}
                  onValueChange={(val) =>
                    _updateRequestedCopies(item._id, Number(val))
                  }
                />
              </Card>
            );
          }}
        />
        {cart.length > 0 ? (
          <Text
            align="right"
            text={`${msgs.total}: ${calculateSum(cartBooksVOs)}`}
          />
        ) : (
          <Text align="center" text={msgs.emptyCart} />
        )}
        <Button
          label={msgs.continue}
          onPress={() => navigation.navigate('deliveryScreen', {})}
        />
        <Snackbar
          duration={5000}
          visible={isSnackBarVisible}
          onDismiss={() => setSnackBarVisible(false)}>
          {snackBarMsg}
        </Snackbar>
      </Row>
    </Grid>
  );
}
