import {staticFileUrl} from '../../app.config';
import {Book} from 'book/book';
import BookService from 'book/book-service';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, View, TouchableHighlight} from 'react-native';
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
import {styles} from 'constants/styles';
import {getIconColor, updateFavOrCart} from './common-actions';
import {getMessages} from 'constants/in18/messages';

export function BookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookScreen'>) {
  const [books, setBooks] = useState([] as Book[]);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [favBooks, setFavBooks] = useState(route.params.fav);
  const [cartBooks, setCartBooks] = useState(route.params.cart);
  const bookService = new BookService();

  useEffect(() => {
    bookService.findByNewArrivals().then((bks) => {
      setBooks(bks);
    });
  }, [bookService]);

  const navToBookDetails = (book: Book) => {
    navigation.navigate('bookDetailsScreen', book);
  };
  /*
  const sumCart = () => {
    const cart = booksInCart.concat(book);
    const sum: number = cart
      .map((bk) => bk.price)
      .reduce((acc, cur) => {
        return Number(acc) + Number(cur);
      }, 0);
    global.setRightHeaderLabel(`Checkout ..${sum}`);
  };
*/
  const updateFav = (bookName: string) => {
    updateFavOrCart(bookName, favBooks, 'fav').then((favs) => {
      favs.length > favBooks.length
        ? setSnackBarMsg(getMessages().addedToFav)
        : setSnackBarMsg(getMessages().removedFromFav);
      setFavBooks(favs);
      setSnackBarVisible(true);
    });
  };

  const updateCart = (bookName: string) => {
    updateFavOrCart(bookName, cartBooks, 'cart').then((cart) => {
      cart.length > cartBooks.length
        ? setSnackBarMsg(getMessages().addedToCart)
        : setSnackBarMsg(getMessages().removedFromCart);
      setCartBooks(cart);
      setSnackBarVisible(true);
    });
  };

  const Item = ({book}: {book: Book}) => {
    return (
      <Card width="50%">
        <TouchableHighlight
          testID="touchable"
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
          style={{
            ...styles.fav,
            backgroundColor: getIconColor(book.name, favBooks),
          }}
          onPress={() => updateFav(book.name)}
        />
        <Fab
          icon="cart-outline"
          style={{
            ...styles.cart,
            backgroundColor: getIconColor(book.name, cartBooks),
          }}
          onPress={() => updateCart(book.name)}
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
          {snackBarMsg}
        </Snackbar>
      </Col>
    </Grid>
  );
}
