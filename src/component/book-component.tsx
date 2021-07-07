import {getStyles} from 'constants/styles';
import {Book} from 'domain/book/book';
import {bookService} from 'domain/book/book-service';
import React, {useContext} from 'react';
import {Alert, Image, TouchableHighlight, View} from 'react-native';
import {UserContext} from 'user-context';
import {
  addToCart,
  updateFav,
  getIconColor,
  removeFromCart,
} from 'view/book/book-screen-actions';
import {Button, Card, Fab, Text} from 'zenbaei-js-lib/react';
import {staticFileUrl, imagesNames} from '../../app.config';

/**
 *
 * @param updateBookList - it will be called in case of stale book availablity, to update book list.
 */
export const BookComponent = ({
  book,
  onPressImg,
  updateBookList,
  showSnackBar,
}: {
  book: Book;
  onPressImg?: (book: Book) => void;
  updateBookList: (book: Book) => void;
  showSnackBar: (msg: string) => void;
}) => {
  const {cart, setCart, favs, setFavs, msgs, theme} = useContext(UserContext);
  const styles = getStyles(theme);
  const touchableRef = React.createRef<TouchableHighlight>();

  const _updateFav = async (bookId: string) => {
    updateFav(bookId, favs, (modifiedFavs, isAdded) => {
      setFavs(modifiedFavs);
      showSnackBar(isAdded ? msgs.addedToFav : msgs.removedFromFav);
    });
  };

  const _addToCart = async (id: string) => {
    const bk = await bookService.findOne('_id', id);
    if (bk.availableCopies < 1) {
      // stale data
      Alert.alert(msgs.sorryBookNotAvailable);
      updateBookList(bk);
      return;
    }
    addToCart(bk, cart, (modifiedCart) => {
      setCart(modifiedCart);
      showSnackBar(msgs.addedToCart);
      bookService.findOne('_id', id).then((bok) => {
        updateBookList(bok);
      });
    });
  };

  const _removeFromCart = async (bookId: string) => {
    removeFromCart(bookId, cart, (modifiedCart) => {
      setCart(modifiedCart);
      showSnackBar(msgs.removedFromCart);
    });
  };

  return (
    <Card width="47%">
      <TouchableHighlight
        ref={touchableRef}
        disabled={false}
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
          testID="copies"
          style={{...styles.bold, ...styles.price}}
          text={`${msgs.availableCopies}: ${book.availableCopies}`}
        />
      </View>
      {cart.find((car) => car.bookId === book._id) ? (
        <Button
          testID={'removeFromCartBtn'}
          style={styles.addToCartBtn}
          label={msgs.removeFromCart}
          onPress={() => _removeFromCart(book._id)}
        />
      ) : (
        <Button
          testID={'addToCartBtn'}
          style={styles.addToCartBtn}
          label={msgs.addToCart}
          onPress={() => _addToCart(book._id)}
        />
      )}
    </Card>
  );
};
