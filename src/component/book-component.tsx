import {getStyles} from 'constants/styles';
import {Book} from 'domain/book/book';
import React, {useContext} from 'react';
import {Alert, Image, TouchableHighlight, View} from 'react-native';
import {UserContext} from 'user-context';
import {
  addOrRmvFrmCart,
  updateFav,
  getIconColor,
  findBook,
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

  const _updateFav = async (bookId: string) => {
    updateFav(bookId, favs, (modifiedFavs, isAdded) => {
      setFavs(modifiedFavs);
      showSnackBar(isAdded ? msgs.addedToFav : msgs.removedFromFav);
    });
  };

  const _addOrRmvFrmCart = async (id: string, addOrRmv: 1 | -1) => {
    const bk = await findBook(id);
    if (bk.inventory < 1) {
      // stale data
      Alert.alert(msgs.sorryBookNotAvailable);
      updateBookList(bk);
      return;
    }
    addOrRmvFrmCart(bk, cart, addOrRmv, (modifiedCart) => {
      setCart(modifiedCart);
      addOrRmv === 1
        ? showSnackBar(msgs.addedToCart)
        : showSnackBar(msgs.removedFromCart);
      findBook(id).then((bok) => {
        updateBookList(bok);
      });
    });
  };

  return (
    <Card width="47%">
      <TouchableHighlight
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
          text={`${msgs.availableCopies}: ${book.inventory}`}
        />
      </View>
      {cart.find((car) => car.bookId === book._id) ? (
        <Button
          testID={'removeFromCartBtn'}
          style={styles.addToCartBtn}
          label={msgs.removeFromCart}
          onPress={() => _addOrRmvFrmCart(book._id, -1)}
        />
      ) : (
        <Button
          testID={'addToCartBtn'}
          style={styles.addToCartBtn}
          label={msgs.addToCart}
          onPress={() => _addOrRmvFrmCart(book._id, 1)}
        />
      )}
    </Card>
  );
};
