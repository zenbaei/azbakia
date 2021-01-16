import {staticFileUrl} from '../../app.config';
import {Book} from 'book/book';
import {userService} from 'user/user-service';
import {bookService} from 'book/book-service';
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

export function HomeScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'homeScreen'>) {
  const [books, setBooks] = useState([] as Book[]);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [favBooks, setFavBooks] = useState(route.params.favBooks);
  const [booksInCart, setBooksInCart] = useState([] as Book[]);

  useEffect(() => {
    bookService.findByNewArrivals().then((bks) => {
      setBooks(bks);
    });
  }, []);

  const navToBookDetails = (book: Book) => {
    //bookService.getByUnique('_id', book._id);
    navigation.navigate('bookDetailsScreen', book);
  };

  const addToFav = (bookName: string) => {
    if (favBooks.find((val) => val === bookName)) {
      return;
    }
    const favs: string[] = [...favBooks, bookName];
    userService
      .addToFavBook(global.user._id, favs)
      .then(() => setFavBooks(favs));
  };

  const getFavIcon = (bookName: string): string => {
    if (favBooks.find((val) => val === bookName)) {
      return 'heart-outline';
    }
    return 'heart';
  };

  const addToCart = (book: Book) => {
    if (booksInCart.find((bk) => bk.name === book.name)) {
      return;
    }
    const cart = booksInCart.concat(book);
    const sum: number = cart
      .map((bk) => bk.price)
      .reduce((acc, cur) => {
        return Number(acc) + Number(cur);
      }, 0);

    userService.addToCart(
      global.user._id,
      cart.map((bok) => bok.name),
    );
    global.setRightHeaderLabel(`Checkout ..${sum}`);
    setBooksInCart(cart);
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
          icon={getFavIcon(book.name)}
          style={styles.fav}
          onPress={() => addToFav(book.name)}
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
