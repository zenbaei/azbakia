import {imagesNames, staticFileUrl} from '../../../app.config';
import {Book} from 'domain/book/book';
import React, {useCallback, useContext, useState} from 'react';
import {Image, ScrollView, View, TouchableHighlight} from 'react-native';
import {
  Col,
  Grid,
  DataGrid,
  NavigationProps,
  Text,
  Card,
  Fab,
  Button,
  Ctx,
} from 'zenbaei-js-lib/react';
import {NavigationScreens} from 'constants/navigation-screens';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {getStyles} from 'constants/styles';
import {getIconColor} from '../common-actions';
import {getMessage, getMessages} from 'constants/in18/messages';

import {addToCart, loadBooks, updateFav} from './book-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'zenbaei-js-lib/utils';

export function BookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookScreen'>) {
  const [books, setBooks] = useState([] as Book[]);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const {cart, setCart, favs, setFavs} = useContext(UserContext);
  const genre = route.params.genre;
  const {theme} = useContext(Ctx);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(getMessages().home);
      cart.length > 0
        ? global.setDisplayCartBtn('flex')
        : global.setDisplayCartBtn('none');
      loadBooks(genre).then((bks) => setBooks(bks));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [genre, cart]),
  );

  const navToBookDetails = (book: Book) =>
    navigation.navigate('bookDetailsScreen', book);

  const _updateFav = async (bookId: string) => {
    updateFav(bookId, favs, (modifiedFavs, isAdded) => {
      setSnackBarMsg(
        isAdded ? getMessages().addedToFav : getMessages().removedFromCart,
      );
      setFavs(modifiedFavs);
      setSnackBarVisible(true);
    });
  };

  const _addToCart = (book: Book) => {
    addToCart(book._id, book.availableCopies, cart, (modifiedCart) => {
      setCart(modifiedCart);
      setSnackBarMsg(getMessages().addedToCart);
      setSnackBarVisible(true);
    });
  };

  const Item = ({book}: {book: Book}) => {
    return (
      <Card width="47%">
        <TouchableHighlight
          testID="touchable"
          key={book.name + 'toh'}
          onPress={() => {
            navToBookDetails(book);
          }}>
          <Image
            source={{
              uri: `${staticFileUrl}/${book.imageFolderName}/${imagesNames[0]}`,
            }}
            style={styles.image}
          />
        </TouchableHighlight>
        <Fab
          icon="heart-outline"
          style={{
            ...styles.fav,
            backgroundColor: getIconColor(book._id, favs, theme),
          }}
          onPress={() => _updateFav(book._id)}
        />
        <View style={styles.wide}>
          <Text style={{...styles.title, ...styles.bold}} text={book.name} />
          <Text style={{...styles.bold, ...styles.price}} text={book.price} />
          <Text
            style={{...styles.bold, ...styles.price}}
            text={`${getMessages().availableCopies}: ${book.availableCopies}`}
          />
        </View>
        <Button
          style={styles.addToCartButton}
          label={getMessages().addToCart}
          onPress={() => _addToCart(book)}
        />
      </Card>
    );
  };

  return (
    <Grid>
      <Col>
        <Text
          text={isEmpty(genre) ? getMessages().newArrivals : getMessage(genre)}
          align="center"
        />
        <ScrollView>
          <DataGrid
            horizontalAlignment={'space-between'}
            data={books}
            columns={2}
            renderItem={(book: Book, _index: number) => (
              <Item key={book.name} book={book} />
            )}
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
