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
  loadCartProductsVOs,
  flatenNumberToArray,
  updateQuantity,
} from './cart-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/core';
import {CartProductVO} from './cart-product-vo';
import {findProduct as findProduct} from 'view/product/product-screen-actions';
import {Product} from 'domain/product/product';
import {ProductComponent} from 'view/product/product-component';

export function CartScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'cartScreen'>) {
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const {cart, setCart, msgs, theme, currency} = useContext(UserContext);
  const [cartBooksVOs, setCartProductsVOs] = useState([] as CartProductVO[]);
  const [total, setTotal] = useState(0);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.cart);
      global.setDisplayCartBtn(undefined);
      setShowLoadingIndicator(true);
      loadCartProductsVOs(cart.products).then((vo) => {
        setCartProductsVOs(vo);
        setTotal(calculateSum(vo));
        setShowLoadingIndicator(false);
      });
    }, [cart, msgs]),
  );

  const _updateQuantity = async (
    productId: string,
    oldQuantity: number,
    newQuantity: number,
  ) => {
    const product = await findProduct(productId);
    if (product.inventory + oldQuantity < newQuantity) {
      _updateDisplayedProductInventory(product);
      Alert.alert(msgs.sorryInventoryChanged);
      return;
    }
    updateQuantity(product, cart, oldQuantity, newQuantity, (crt) => {
      setCart(crt);
      setSnackBarMsg(msgs.amountUpdated);
      setSnackBarVisible(true);
    });
  };

  const _updateDisplayedProductInventory = (product: Product) => {
    const cartVOs = cartBooksVOs.map((vo) => {
      if (vo._id === product._id) {
        vo.inventory = product.inventory;
      }
      return vo;
    });
    setCartProductsVOs(cartVOs);
  };

  return cart.products.length > 0 ? (
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
                          onPressImg={() =>
                            navigation.navigate('productDetailsScreen', {
                              product: {
                                _id: item._id,
                                name: item.name,
                                price: item.price,
                                inventory: item.inventory,
                                description: item.description,
                                language: item.language,
                              } as Product,
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
