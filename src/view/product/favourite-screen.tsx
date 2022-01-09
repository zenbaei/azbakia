import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import {Product} from 'domain/product/product';
import {productService} from 'domain/product/product-service';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {UserContext} from 'user-context';
import {Loading} from 'view/loading-component';
import {Col, Grid, NavigationProps, Row, SnackBar} from 'zenbaei-js-lib/react';
import {ProductComponent} from './product-component';

export function FavouriteScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'favouriteScreen'>) {
  const {favs, msgs, cart} = useContext(UserContext);
  const [books, setBooks] = useState([] as Product[]);
  const [isShowLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setBooks([] as Product[]);
      global.setAppBarTitle(msgs.favourite);
      global.setDisplayCartBtn(cart);
      if (favs?.length > 0) {
        setShowLoadingIndicator(true);
        productService.findAllByProductIds(favs).then((bks) => {
          setBooks(bks);
          setShowLoadingIndicator(false);
        });
      }
    }, [favs, msgs, cart]),
  );

  return (
    <>
      <Loading
        visible={books?.length < 1}
        showLoading={isShowLoadingIndicator}
        text={msgs.noFavBooks}
      />
      <Grid>
        <Row>
          <Col>
            <FlatList
              testID="flatList"
              scrollEnabled
              numColumns={2}
              data={books}
              keyExtractor={(item) => item._id}
              renderItem={({item}) => (
                <ProductComponent
                  product={item}
                  onPressImg={() =>
                    navigation.navigate('productDetailsScreen', {id: item._id})
                  }
                  updateDisplayedProduct={() => {}}
                  showSnackBar={(msg) => {
                    setSnackBarVisible(true);
                    setSnackBarMsg(msg);
                  }}
                />
              )}
            />
          </Col>
        </Row>
      </Grid>
      <SnackBar
        msg={snackBarMsg}
        onDismiss={setSnackBarVisible}
        visible={isSnackBarVisible}
      />
    </>
  );
}
