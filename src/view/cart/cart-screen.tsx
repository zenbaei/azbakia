import {getMessages} from 'constants/in18/messages';
import {NavigationScreens} from 'constants/navigation-screens';
import {getStyles} from 'constants/styles';
import React, {useCallback, useContext, useState} from 'react';
import {Image} from 'react-native';
import {
  Button,
  Card,
  Col,
  Ctx,
  DataGrid,
  Grid,
  NavigationProps,
  Text,
} from 'zenbaei-js-lib/react';
import {imagesNames, staticFileUrl} from '../../../app.config';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {ScrollView} from 'react-native-gesture-handler';
import {
  calculateSum,
  loadCartBooksVOs,
  removeFromCart,
} from './cart-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/core';
import {CartBookVO} from './cart-book-vo';

export function CartScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'cartScreen'>) {
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const {cart, setCart} = useContext(UserContext);
  const [cartBooksVOs, setCartBooksVOs] = useState([] as CartBookVO[]);
  const {theme} = useContext(Ctx);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(getMessages().cart);
      global.setDisplayCartBtn('none');
      loadCartBooksVOs(cart).then((vo) => setCartBooksVOs(vo));
    }, [cart]),
  );

  const _removeFromCart = async (cartBookVO: CartBookVO) => {
    removeFromCart(
      cartBookVO._id,
      cartBookVO.availableCopies,
      cart,
      (modifiedCart) => {
        setCart(modifiedCart);
        setSnackBarMsg(getMessages().removedFromCart);
        setSnackBarVisible(true);
      },
    );
  };

  return (
    <Grid>
      <Col>
        <ScrollView>
          <DataGrid
            data={cartBooksVOs}
            columns={1}
            renderItem={(vo, _index) => {
              return (
                <Card key={vo.name}>
                  <Image
                    source={{
                      uri: `${staticFileUrl}/${vo.imageFolderName}/${imagesNames[0]}`,
                    }}
                    style={styles.image}
                  />
                  <Text text={vo.name} />
                  <Text text={vo.price} />
                  <Text
                    style={{...styles.bold, ...styles.price}}
                    text={`${getMessages().nuOfCopies}: ${vo.nuOfCopies}`}
                  />
                  <Button
                    label={getMessages().removeFromCart}
                    onPress={() => _removeFromCart(vo)}
                  />
                </Card>
              );
            }}
          />
        </ScrollView>
        {cart.length > 0 ? (
          <Text
            align="right"
            text={`${getMessages().total}: ${calculateSum(cartBooksVOs)}`}
          />
        ) : (
          <Text align="center" text={getMessages().emptyCart} />
        )}
        <Button
          label={getMessages().continue}
          onPress={() => navigation.navigate('deliveryScreen', {})}
        />
        <Snackbar
          duration={5000}
          visible={isSnackBarVisible}
          onDismiss={() => setSnackBarVisible(false)}>
          {snackBarMsg}
        </Snackbar>
      </Col>
    </Grid>
  );
}
