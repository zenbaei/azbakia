import {NavigationScreens} from 'constants/navigation-screens';
import {getStyles} from 'constants/styles';
import React, {useCallback, useContext, useState} from 'react';
import {ActivityIndicator, Alert} from 'react-native';
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
import {findBook} from 'view/product/product-screen-actions';
import {Product} from 'domain/product/product';
import {ProductComponent} from 'view/product/product-component';

export function CartScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'cartScreen'>) {
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const {cart, setCart, msgs, theme, currency} = useContext(UserContext);
  const [cartBooksVOs, setCartBooksVOs] = useState([] as CartBookVO[]);
  const [total, setTotal] = useState(0);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.cart);
      global.setDisplayCartBtn(undefined);
      setShowLoadingIndicator(true);
      loadCartBooksVOs(cart).then((vo) => {
        setCartBooksVOs(vo);
        setTotal(calculateSum(vo));
        setShowLoadingIndicator(false);
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

  const _updateDisplayedBookInventory = (book: Product) => {
    const cartVOs = cartBooksVOs.map((vo) => {
      if (vo._id === book._id) {
        vo.inventory = book.inventory;
      }
      return vo;
    });
    setCartBooksVOs(cartVOs);
  };

  return cart.length > 0 ? (
    <>
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
                        <ProductComponent
                          cartScreen
                          product={
                            {
                              _id: item._id,
                              name: item.name,
                              price: item.price,
                            } as Product
                          }
                          updateDisplayedProduct={() => {}}
                          showSnackBar={(msg) => {
                            setSnackBarMsg(msg);
                            setSnackBarVisible(true);
                          }}
                          onPressImg={(bk) =>
                            navigation.navigate('productDetailsScreen', {
                              id: bk._id,
                            })
                          }
                        />
                      </Col>
                      <Col height="100%" verticalAlign="center">
                        <Text
                          color={theme.secondary}
                          align="center"
                          style={(styles.bold, styles.cartQty)}
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
                            _updateQuantity(
                              item._id,
                              item.quantity,
                              Number(val),
                            )
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
              color={theme.secondary}
              align="right"
              text={`${msgs.total}: ${total} ${currency}`}
            />
            <Button
              width="100%"
              label={msgs.continue}
              onPress={() =>
                navigation.navigate('deliveryScreen', {
                  cartTotalPrice: total,
                })
              }
            />
          </Col>
        </Row>
      </Grid>
      <SnackBar
        visible={isSnackBarVisible}
        msg={snackBarMsg}
        onDismiss={setSnackBarVisible}
      />
    </>
  ) : (
    <Grid>
      <Row>
        <Col verticalAlign={'center'}>
          <ActivityIndicator
            animating={showLoadingIndicator}
            color={theme.secondary}
          />
          <Text mediumEmphasis align="center" text={msgs.emptyCart} />
        </Col>
      </Row>
    </Grid>
  );
}
