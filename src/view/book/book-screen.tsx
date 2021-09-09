import {Book} from 'domain/book/book';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Grid, NavigationProps, Text, Row, Col} from 'zenbaei-js-lib/react';
import {NavigationScreens} from 'constants/navigation-screens';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {
  findBook,
  loadBooksByPage,
  searchBooksProjected,
  loadSearchedBooksByPage,
  loadFirstSearchedBooksPageAndCalcTotalPageNumber,
  loadFirstBooksPageAndCalcTotalPagesNumber,
} from './book-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'zenbaei-js-lib/utils';
import ActivityIndicator from 'react-native-paper/src/components/ActivityIndicator';
import {SearchBar} from 'view/search-bar';
import {BookComponent} from 'component/book-component';

export function BookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookScreen'>) {
  const [books, setBooks] = useState([] as Book[]);
  const subGenre = route.params?.subGenre;
  const [page, setPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(1);
  const [animating, setAnimating] = useState(false);
  const {cart, msgs, theme, language} = useContext(UserContext);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const minSearchTextLength: number = 2;

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.home);
      loadFirstBooksPageAndCalcTotalPagesNumber(
        subGenre?.nameEn,
        (result, totalPagesNumber) => {
          setMaxPageNumber(totalPagesNumber);
          setBooks(result);
          setPage(1);
        },
      );
    }, [subGenre, msgs]),
  );

  useFocusEffect(
    useCallback(() => {
      cart.length > 0
        ? global.setDisplayCartBtn('flex')
        : global.setDisplayCartBtn('none');
    }, [cart.length]),
  );

  const loadNextPage = async () => {
    let result: Book[];
    if (page === maxPageNumber) {
      return;
    }
    setAnimating(true);
    if (searchToken.length > 0) {
      result = await loadSearchedBooksByPage(searchToken, page);
    } else {
      const bks = await loadBooksByPage(subGenre?.nameEn, page);
      result = [...books, ...bks];
    }
    setBooks(result);
    setPage(page + 1);
    setAnimating(false);
  };

  const onBlurHandler = async (text: string) => {
    setSearchToken(text);
    loadFirstSearchedBooksPageAndCalcTotalPageNumber(
      text,
      (result, totalPagesNumber) => {
        setBooks(result);
        setMaxPageNumber(totalPagesNumber);
        setPage(1);
      },
    );
  };

  const _updateisplayedBook = (book: Book) => {
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
        <Col verticalAlign={'flex-start'}>
          <SearchBar
            minLength={minSearchTextLength}
            onChangeText={async (text) => {
              const result = await searchBooksProjected(text);
              return result.map((bk) => ({value: bk._id, label: bk.name}));
            }}
            onSelectItem={async (id: string) => {
              const book = await findBook(id);
              setBooks([book]);
            }}
            onBlur={onBlurHandler}
          />
          <Text
            style={styles.boldText}
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
              style={styles.centerSelf}
              scrollEnabled
              numColumns={2}
              data={books}
              keyExtractor={(item) => item._id}
              onEndReached={loadNextPage}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              renderItem={({item}) => (
                <BookComponent
                  book={item}
                  onPressImg={() =>
                    navigation.navigate('bookDetailsScreen', item)
                  }
                  updateDisplayedBook={(book: Book) => {
                    _updateisplayedBook(book);
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
              testID={'noResultFound'}
              text={msgs.noResultFound}
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
        </Col>
      </Row>
    </Grid>
  );
}

const styles = StyleSheet.create({
  centerSelf: {alignSelf: 'center'},
  boldText: {fontWeight: 'bold'},
});
