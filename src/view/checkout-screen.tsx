import {Book} from 'book/book';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useEffect, useState} from 'react';
import {
  Card,
  Col,
  DataGrid,
  Grid,
  NavigationProps,
  Text,
} from 'zenbaei-js-lib/react';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

export function CheckoutScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'checkoutScreen'>) {
  const [booksInCart, setBooksInCart] = useState([] as Book[]);
  const {getItem} = useAsyncStorage('booksInCart');
  useEffect(() => {
    getItem().then((bks) => setBooksInCart(JSON.parse(bks as string)));
  }, []);
  return (
    <Grid>
      <Col>
        <DataGrid
          data={booksInCart}
          columns={1}
          renderItem={(book, _index) => {
            return (
              <Card key={book.name}>
                <Text text={book.name} />
                <Text text={book.price} />
              </Card>
            );
          }}
        />
      </Col>
    </Grid>
  );
}
