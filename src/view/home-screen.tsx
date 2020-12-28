import {staticFileUrl} from '../../app.config';
import {Book} from 'book/book';
import {bookService} from 'book/book-service';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {
  Col,
  Grid,
  DataGrid,
  NavigationProps,
  Text,
  Card,
  Fab,
} from 'zenbaei-js-lib/react';
import {NavigationScreens} from 'constants/navigation-screens';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {cartService} from 'cart/cart-service';
import {getAppTheme} from 'zenbaei-js-lib/themes';
import {styles} from 'constants/styles';

const booksInCart: Book[] = [];

export function HomeScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'homeScreen'>) {
  const [books, setBooks] = useState([] as Book[]);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useEffect(() => {
    cartService.getUserCart(global.userEmail).then((savedBooks) => {
      if (savedBooks) {
        // booksInCart.concat(JSON.parse(savedBooks));
      }
    });

    bookService.getByQuery({newArrival: true}).then((bks) => {
      const arr: Book[] = bks ? bks : [];
      setBooks(arr);
    });
  }, []);

  const navToBookDetails = (book: Book) => {
    //bookService.getByUnique('_id', book._id);
    navigation.navigate('bookDetailsScreen', book);
  };

  const addToCart = async (book: Book) => {
    if (booksInCart.find((bk) => bk.name === book.name)) {
      return;
    }
    booksInCart.push(book);
    const sum: number = booksInCart
      .map((bk) => bk.price)
      .reduce((acc, cur) => {
        return Number(acc) + Number(cur);
      }, 0);
    cartService.addToCart(book.name, global.userEmail);
    global.setRightHeaderLabel(`Checkout ..${sum}`);
    setSnackBarVisible(true);
  };

  const Item = ({book}: {book: Book}) => {
    return (
      <Card width="50%">
        <TouchableHighlight
          key={book.name + 'toh'}
          onPress={() => {
            navToBookDetails(book);
          }}>
          <Image
            source={{uri: `${staticFileUrl}/${book.name}/main.jpg`}}
            style={styles.image}
          />
        </TouchableHighlight>
        <Fab
          icon="heart-outline"
          style={styles.fav}
          onPress={() => console.log('Pressed')}
        />
        <Fab
          icon="cart-outline"
          style={styles.cart}
          onPress={() => {
            addToCart(book);
          }}
        />
        <View style={styles.wide}>
          <Text style={{...styles.title, ...styles.bold}} text={book.name} />
          <Text style={{...styles.bold, ...styles.price}} text={book.price} />
        </View>
      </Card>
    );
  };

  return (
    <Grid>
      <Col>
        <ScrollView>
          <DataGrid
            data={books}
            columns={2}
            renderItem={(book: Book, _index: number) => {
              return <Item key={book.name} book={book} />;
            }}
          />
        </ScrollView>
        <Snackbar
          duration={5000}
          visible={isSnackBarVisible}
          onDismiss={() => setSnackBarVisible(false)}>
          Added to cart
        </Snackbar>
      </Col>
    </Grid>
  );
}
