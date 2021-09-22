import {NavigationScreens} from 'constants/navigation-screens';
import {getStyles} from 'constants/styles';
import React, {useCallback, useContext, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {
  Button,
  Row,
  Grid,
  NavigationProps,
  Text,
  Picker,
  Col,
  SnackBar,
} from 'zenbaei-js-lib/react';
import {FlatList} from 'react-native-gesture-handler';
import {
  calculateSum,
  loadCartBooksVOs,
  flatenNumberToArray,
  updateQuantity,
} from './cart-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/core';
import {CartBookVO} from './cart-book-vo';
import {findBook} from 'view/book/book-screen-actions';
import {Book} from 'domain/book/book';

import {BookComponent} from 'view/book/book-component';
import {currency} from '../../../app.config';

export function CartScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'cartScreen'>) {
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const {cart, setCart, msgs, theme} = useContext(UserContext);
  const [cartBooksVOs, setCartBooksVOs] = useState([] as CartBookVO[]);
  const [total, setTotal] = useState(0);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.cart);
      global.setDisplayCartBtn('none');
      loadCartBooksVOs(cart).then((vo) => {
        setCartBooksVOs(vo);
        setTotal(calculateSum(vo));
      });
    }, [cart, msgs]),
  );

  const _updateQuantity = async (
    bookId: string,
    oldQuantity: number,
    newQuantity: number,
  ) => {
    const book = await findBook(bookId);
    if (book.inventory + oldQuantity < newQuantity) {
      _updateDisplayedBookInventory(book);
      Alert.alert(msgs.sorryInventoryChanged);
      return;
    }
    updateQuantity(book, cart, oldQuantity, newQuantity, (crt) => {
      setCart(crt);
      setSnackBarMsg(msgs.amountUpdated);
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
                          navigation.navigate('bookDetailsScreen', {id: bk._id})
                        }
                      />
                    </Col>
                    <Col height="100%" verticalAlign="center">
                      <Text
                        align="center"
                        style={{...styles.bold, ...inlineStyle.textPadding}}
                        text={`${msgs.quantity}`}
                      />
                      <Picker
                        width={'100%'}
                        data={flatenNumberToArray(
                          item.inventory + item.quantity,
                        )}
                        selectedValue={String(item.quantity)}
                        key={item._id}
                        onValueChange={(val) =>
                          _updateQuantity(item._id, item.quantity, Number(val))
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
          <Text align="right" text={`${msgs.total}: ${total} ${currency}`} />
          <Button
            label={msgs.continue}
            onPress={() =>
              navigation.navigate('deliveryScreen', {
                cartTotalPrice: total,
              })
            }
          />
          <SnackBar
            visible={isSnackBarVisible}
            msg={snackBarMsg}
            onDismiss={setSnackBarVisible}
          />
        </Col>
      </Row>
    </Grid>
  ) : (
    <Grid>
      <Row>
        <Col verticalAlign={'center'}>
          <Text mediumEmphasis align="center" text={msgs.emptyCart} />
        </Col>
      </Row>
    </Grid>
  );
}

const inlineStyle = StyleSheet.create({textPadding: {paddingBottom: 10}});
