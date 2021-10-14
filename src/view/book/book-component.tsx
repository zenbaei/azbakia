import {bookCardWidth, bookCardWidthBig} from 'constants/styles';
import {Book} from 'domain/book/book';
import React, {useContext} from 'react';
import {AlertButton, ViewStyle} from 'react-native';
import {Alert, Image, TouchableHighlight} from 'react-native';
import IconButton from 'react-native-paper/src/components/IconButton';
import {UserContext} from 'user-context';
import {
  addOrRmvFrmCart,
  updateFav,
  getIconColor,
  findBook,
  getCartIconColor,
  isInCart,
  requestBook,
} from 'view/book/book-screen-actions';
import {Card, Fab, Text} from 'zenbaei-js-lib/react';
import {staticFileUrl} from '../../../app.config';

/**
 *
 * @param updateDisplayedBook - Replaces displayed book with the most recent
 * from db after update or in case of stale data.
 */
export const BookComponent = ({
  book,
  onPressImg,
  updateDisplayedBook,
  showSnackBar,
  cartScreen = false,
  centerCard = false,
}: {
  book: Book;
  onPressImg?: (book: Book) => void;
  updateDisplayedBook: (book: Book) => void;
  showSnackBar: (msg: string) => void;
  cartScreen?: boolean;
  centerCard?: boolean;
}) => {
  const {
    cart,
    setCart,
    favs,
    setFavs,
    msgs,
    theme,
    styles,
    imgFileNames,
    currency,
  } = useContext(UserContext);
  const cartScreenVisibilty: ViewStyle = cartScreen
    ? styles.hidden
    : styles.visible;

  const _updateFav = async (bookId: string) => {
    updateFav(bookId, favs, (modifiedFavs, isAdded) => {
      setFavs(modifiedFavs);
      showSnackBar(isAdded ? msgs.addedToFav : msgs.removedFromFav);
    });
  };

  const _addOrRmvFrmCart = async (id: string, addOrRmv: 1 | -1) => {
    const bk = await findBook(id);
    if (addOrRmv === 1 && bk.inventory < 1) {
      // stale data
      Alert.alert('', msgs.sorryBookNotAvailable, alertBtns(bk._id));
      updateDisplayedBook(bk);
      return;
    }
    addOrRmvFrmCart(bk, cart, (modifiedCart) => {
      setCart(modifiedCart);
      addOrRmv === 1
        ? showSnackBar(msgs.addedToCart)
        : showSnackBar(msgs.removedFromCart);
      findBook(id).then((bok) => {
        updateDisplayedBook(bok);
      });
    });
  };

  const _requestBook = (id: string) => {
    requestBook(id).then(() => showSnackBar(msgs.requestSaved));
  };

  const alertBtns = (bookId: string): AlertButton[] => {
    return [
      {text: msgs.yes, onPress: () => _requestBook(bookId)},
      {text: msgs.no},
    ];
  };

  return (
    <Card
      width={cartScreen ? bookCardWidthBig : bookCardWidth}
      style={centerCard ? styles.flexCenter : styles.flexStart}>
      <TouchableHighlight
        testID="touchable"
        key={book.name + 'toh'}
        onPress={() => {
          onPressImg === undefined ? () => {} : onPressImg(book);
        }}>
        <Image
          source={{
            uri: `${staticFileUrl}/${book.imgFolderName}/${imgFileNames[0]}`,
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
      <Text style={styles.title} text={book.name} color={theme.secondary} />
      <Text
        align="right"
        style={{...styles.bold, ...styles.price}}
        text={`${book.price} ${currency}`}
      />
      <Text
        visible={book.inventory !== undefined && book.inventory > 0}
        align="right"
        testID="copies"
        style={{...styles.bold, ...styles.price, ...cartScreenVisibilty}}
        text={`${msgs.stock}: ${book.inventory}`}
      />
      <IconButton
        testID={'removeFromCartBtn'}
        icon="cart-outline"
        color={isInCart(book._id, cart) ? theme.primary : theme.onBackground}
        style={[
          cartScreenVisibilty,
          styles.flexEnd,
          {backgroundColor: getCartIconColor(book._id, cart, theme)},
        ]}
        onPress={() =>
          _addOrRmvFrmCart(book._id, isInCart(book._id, cart) ? -1 : 1)
        }
      />
      <IconButton
        style={[styles.flexEnd, cartScreen ? styles.visible : styles.hidden]}
        icon={'delete'}
        color={theme.secondary}
        onPress={() => _addOrRmvFrmCart(book._id, -1)}
      />
    </Card>
  );
};
