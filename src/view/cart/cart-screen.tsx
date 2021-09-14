import {NavigationScreens} from 'constants/navigation-screens';
import {getStyles} from 'constants/styles';
import React, {useCallback, useContext, useState} from 'react';
import {Alert} from 'react-native';
import {
  Button,
  Row,
  Grid,
  NavigationProps,
  Text,
  Picker,
  Col,
} from 'zenbaei-js-lib/react';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {FlatList} from 'react-native-gesture-handler';
import {
  calculateSum,
  loadCartBooksVOs,
  flatenNumberToArray,
  updateAmount,
} from './cart-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/core';
import {CartBookVO} from './cart-book-vo';
import {findBook} from 'view/book/book-screen-actions';
import {Book} from 'domain/book/book';

import {BookComponent} from 'component/book-component';
import {currency} from '../../../app.config';

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
    }, [cart, msgs]),
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
  const _updateAmount = async (
    bookId: string,
    oldAmount: number,
    newAmount: number,
  ) => {
    const book = await findBook(bookId);
    if (book.inventory + oldAmount < newAmount) {
      _updateDisplayedBookInventory(book);
      Alert.alert(msgs.sorryInventoryChanged);
      return;
    }
    updateAmount(book, cart, oldAmount, newAmount, (crt) => {
      setCart(crt);
      setSnackBarMsg(msgs.updated);
      setSnackBarVisible(true);
    });
  };

  const _updateDisplayedBookInventory = (book: Book) => {
    const cartVOs = cartBooksVOs.map((vo) => {
      if (vo._id === book._id) {
        vo.inventory = book.inventory;
      }
      return vo;
    });
    setCartBooksVOs(cartVOs);
  };

  return cart.length > 0 ? (
    <Grid>
      <Row proportion={1}>
        <Col>
          <FlatList
            data={cartBooksVOs}
            numColumns={1}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => {
              return (
                <Grid>
                  <Row>
                    <Col proportion={2}>
                      <BookComponent
                        cartScreen
                        book={
                          {
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            imageFolderName: item.imageFolderName,
                          } as Book
                        }
                        updateDisplayedBook={() => {}}
                        showSnackBar={(msg) => {
                          setSnackBarMsg(msg);
                          setSnackBarVisible(true);
                        }}
                        onPressImg={(bk) =>
                          navigation.navigate('bookDetailsScreen', bk)
                        }
                      />
                    </Col>
                    <Col height="100%" verticalAlign="center">
                      <Text
                        align="center"
                        style={{...styles.bold}}
                        text={`${msgs.amount}:`}
                      />
                    </Col>
                    <Col height="100%" verticalAlign="center">
                      <Picker
                        width={'90%'}
                        data={flatenNumberToArray(item.inventory + item.amount)}
                        selectedValue={String(item.amount)}
                        key={item._id}
                        onValueChange={(val) =>
                          _updateAmount(item._id, item.amount, Number(val))
                        }
                      />
                    </Col>
                  </Row>
                </Grid>
              );
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text
            align="right"
            text={`${msgs.total}: ${calculateSum(cartBooksVOs)} ${currency}`}
          />
          <Button
            label={msgs.continue}
            onPress={() => navigation.navigate('deliveryScreen', {})}
          />
          <Snackbar
            duration={2000}
            style={{
              backgroundColor: theme.secondary,
            }}
            visible={isSnackBarVisible}
            onDismiss={() => setSnackBarVisible(false)}>
            {snackBarMsg}
          </Snackbar>
        </Col>
      </Row>
    </Grid>
  ) : (
    <Grid>
      <Row>
        <Col verticalAlign={'center'}>
          <Text
            style={{color: theme.mediumEmphasis}}
            align="center"
            text={msgs.emptyCart}
          />
        </Col>
      </Row>
    </Grid>
  );
}
