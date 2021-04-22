import {getStyles} from 'constants/styles';
import {Book} from 'domain/book/book';
import React, {useContext, useState} from 'react';
import {Image, TouchableHighlight, View} from 'react-native';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {UserContext} from 'user-context';
import {addToCart, updateFav} from 'view/book/book-screen-actions';
import {getIconColor} from 'view/common-actions';
import {Button, Card, Fab, Text} from 'zenbaei-js-lib/react';
import {staticFileUrl, imagesNames} from '../../app.config';

export const BookComponent = ({
  book,
  onPressImg,
}: {
  book: Book;
  onPressImg?: (book: Book) => void;
}) => {
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const {cart, setCart, favs, setFavs, msgs, theme} = useContext(UserContext);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const styles = getStyles(theme);

  const _updateFav = async (bookId: string) => {
    updateFav(bookId, favs, (modifiedFavs, isAdded) => {
      setSnackBarMsg(isAdded ? msgs.addedToFav : msgs.removedFromCart);
      setFavs(modifiedFavs);
      setSnackBarVisible(true);
    });
  };

  const _addToCart = (bok: Book) => {
    addToCart(bok._id, bok.availableCopies, cart, (modifiedCart) => {
      setCart(modifiedCart);
      setSnackBarMsg(msgs.addedToCart);
      setSnackBarVisible(true);
    });
  };

  return (
    <>
      <Card width="47%">
        <TouchableHighlight
          testID="touchable"
          key={book.name + 'toh'}
          onPress={() => {
            onPressImg === undefined ? () => {} : onPressImg(book);
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
            text={`${msgs.availableCopies}: ${book.availableCopies}`}
          />
        </View>
        <Button
          style={styles.addToCartButton}
          label={msgs.addToCart}
          onPress={() => _addToCart(book)}
        />
      </Card>
      <Snackbar
        duration={5000}
        visible={isSnackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}>
        {snackBarMsg}
      </Snackbar>
    </>
  );
};
