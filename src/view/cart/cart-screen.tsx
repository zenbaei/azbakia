import {NavigationScreens} from 'constants/navigation-screens';
import {getStyles} from 'constants/styles';
import React, {useCallback, useContext, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
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
  removeFromCart,
} from './cart-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/core';
import {CartBookVO} from './cart-book-vo';
import {findBook} from 'view/book/book-screen-actions';
import {Book} from 'domain/book/book';
import IconButton from 'react-native-paper/src/components/IconButton';
import {BookComponent} from 'component/book-component';

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
  const _updateAmount = async (
    bookId: string,
    oldAmount: number,
    newAmount: number,
  ) => {
    const book = await findBook(bookId);
    if (book.inventory + oldAmount < newAmount) {
      _updateListedBookInventory(book);
      Alert.alert(msgs.sorryInventoryChanged);
      return;
    }
    updateAmount(book, cart, oldAmount, newAmount, (crt) => setCart(crt));
  };

  const _removeFromCart = (bookId: string) => {
    removeFromCart(bookId, cart, (crt) => {
      setCart(crt);
      setSnackBarVisible(true);
      setSnackBarMsg(msgs.removedFromCart);
    });
  };

  const _updateListedBookInventory = (book: Book) => {
    const cartVOs = cartBooksVOs.map((vo) => {
      if (vo._id === book._id) {
        vo.inventory = book.inventory;
      }
      return vo;
    });
    setCartBooksVOs(cartVOs);
  };

  return (
    <Grid>
      {cart.length > 0 ? (
        <Row>
          <FlatList
            data={cartBooksVOs}
            numColumns={1}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => {
              return (
                <Grid>
                  <Row>
                    <Col horizontalAlignment={'space-around'}>
                      <BookComponent
                        showForCartScreen
                        book={
                          {
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            imageFolderName: item.imageFolderName,
                          } as Book
                        }
                        replaceDisplayedBook={() => {}}
                        showSnackBar={(msg) => {
                          setSnackBarMsg(msg);
                          setSnackBarVisible(true);
                        }}
                        onPressImg={(bk) =>
                          navigation.navigate('bookDetailsScreen', bk)
                        }
                      />
                      <View>
                        <View style={inlineStyles.amountStyle}>
                          <Text
                            style={{...styles.bold}}
                            text={`${msgs.amount}: `}
                          />
                          <Picker
                            width={'40%'}
                            data={flatenNumberToArray(
                              item.inventory + item.amount,
                            )}
                            selectedValue={String(item.amount)}
                            key={item._id}
                            onValueChange={(val) =>
                              _updateAmount(item._id, item.amount, Number(val))
                            }
                          />
                        </View>
                        <IconButton
                          style={inlineStyles.removeIconStyle}
                          icon={'delete'}
                          color={theme.secondary}
                          onPress={() => _removeFromCart(item._id)}
                        />
                      </View>
                    </Col>
                  </Row>
                </Grid>
              );
            }}
          />
          <Text
            align="right"
            text={`${msgs.total}: ${calculateSum(cartBooksVOs)}`}
          />
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
      ) : (
        <Row verticalAlignment={'space-around'}>
          <Col horizontalAlignment={'center'}>
            <Text text={msgs.emptyCart} />
          </Col>
        </Row>
      )}
    </Grid>
  );
}

const inlineStyles = StyleSheet.create({
  amountStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  removeIconStyle: {alignSelf: 'flex-end'},
});
