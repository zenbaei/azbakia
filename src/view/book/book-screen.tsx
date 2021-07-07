import {Book} from 'domain/book/book';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {Grid, NavigationProps, Text, Row} from 'zenbaei-js-lib/react';
import {NavigationScreens} from 'constants/navigation-screens';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {
  findBook,
  calculateMaxPageSize,
  loadBooks,
  searchBooks,
} from './book-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'zenbaei-js-lib/utils';
import ActivityIndicator from 'react-native-paper/src/components/ActivityIndicator';
import {SearchBar} from 'view/search-bar';
import {BookComponent} from 'component/book-component';
import {bookService} from 'domain/book/book-service';

export function BookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookScreen'>) {
  const [books, setBooks] = useState([] as Book[]);
  const subGenre = route.params.subGenre;
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [maxPageSize, setMaxPageSize] = useState(1);
  const {cart, msgs, theme, language} = useContext(UserContext);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      resetBooks();
      calculateMaxPageSize(subGenre).then((val) => {
        setMaxPageSize(val);
      });
    }, [subGenre]),
  );

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.home);
    }, [msgs.home]),
  );

  useFocusEffect(
    useCallback(() => {
      cart.length > 0
        ? global.setDisplayCartBtn('flex')
        : global.setDisplayCartBtn('none');
    }, [cart.length]),
  );

  const navigateToBookDetails = (book: Book) => {
    navigation.navigate('bookDetailsScreen', book);
  };

  const resetBooks = () => {
    loadBooks(subGenre?.nameEn, 0).then((bks) => {
      setBooks(bks);
      setPage(1);
    });
  };

  const loadNextBooks = () => {
    if (page === maxPageSize) {
      return;
    }
    setAnimating(true);
    loadBooks(subGenre?.nameEn, page).then((bks) => {
      const arr = [...books, ...bks];
      setBooks(arr);
      setPage(page + 1);
      setAnimating(false);
    });
  };

  const _updateBookList = (book: Book) => {
    const bks = books.map((bk) => (bk._id === book._id ? book : bk));
    setBooks(bks);
  };

  const renderFooter = () => {
    return (
      <ActivityIndicator animating={animating} color={theme.onBackground} />
    );
  };

  return (
    <Grid testID="grid">
      <Row>
        <SearchBar
          onChangeText={async (text) => {
            const result = await searchBooks(text);
            return result.map((bk) => ({value: bk._id, label: bk.name}));
          }}
          onSelectItem={async (id: string) => {
            const book = await findBook(id);
            navigateToBookDetails(book);
          }}
        />
        <Text
          style={{fontWeight: 'bold'}}
          text={
            isEmpty(subGenre?.nameEn)
              ? msgs.newArrivals
              : language === 'en'
              ? subGenre.nameEn
              : subGenre.nameAr
          }
          align="center"
        />
        {books?.length > 0 ? (
          <FlatList
            testID="flatList"
            style={{alignSelf: 'center'}}
            scrollEnabled
            numColumns={2}
            data={books}
            keyExtractor={(item) => item._id}
            onEndReached={loadNextBooks}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            renderItem={({item}) => (
              <BookComponent
                book={item}
                onPressImg={navigateToBookDetails}
                updateBookList={(book: Book) => {
                  _updateBookList(book);
                }}
                showSnackBar={(msg) => {
                  setSnackBarVisible(true);
                  setSnackBarMsg(msg);
                }}
              />
            )}
          />
        ) : (
          <Text
            text={msgs.noBooksAvailable}
            align="center"
            style={{color: theme.mediumEmphasis}}
          />
        )}
        <Snackbar
          duration={5000}
          visible={isSnackBarVisible}
          onDismiss={() => setSnackBarVisible(false)}>
          {snackBarMsg}
        </Snackbar>
      </Row>
    </Grid>
  );
}
