import {Book} from 'domain/book/book';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {
  Grid,
  NavigationProps,
  Text,
  Row,
  Col,
  SearchBar,
  SnackBar,
} from 'zenbaei-js-lib/react';
import {NavigationScreens} from 'constants/navigation-screens';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {
  findBook,
  loadBooksByPage,
  searchBooksProjected,
  loadSearchedBooksByPage,
  loadFirstSearchedBooksPageAndCalcTotalPageNumber,
  loadFirstBooksPageAndCalcTotalPagesNumber,
  findFavouriteBooks,
} from './book-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'zenbaei-js-lib/utils';
import ActivityIndicator from 'react-native-paper/src/components/ActivityIndicator';
import {BookComponent} from 'view/book/book-component';

export function BookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookScreen'>) {
  const [books, setBooks] = useState([] as Book[]);
  const subGenre = route.params?.subGenre;
  const favourite = route.params?.favourite;
  const [page, setPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [isShowLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [isShowNoBooksTxt, setShowNoBooksTxt] = useState(false);
  const {cart, msgs, theme, language, favs} = useContext(UserContext);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const minSearchTextLength: number = 2;

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.home);
      cart.length > 0
        ? global.setDisplayCartBtn('flex')
        : global.setDisplayCartBtn('none');
    }, [cart.length, msgs]),
  );

  useFocusEffect(
    useCallback(() => {
      setShowLoadingIndicator(true);
      setShowNoBooksTxt(false);
      console.log(favs[0]);
      favourite && favs && favs.length > 0
        ? findFavouriteBooks(favs).then((bks) => (bks ? setBooks(bks) : {}))
        : loadFirstBooksPageAndCalcTotalPagesNumber(
            subGenre?.nameEn,
            (result, totalPagesNumber) => {
              setMaxPageNumber(totalPagesNumber);
              setBooks(result);
              setPage(1);
              if (result.length === 0) {
                setShowNoBooksTxt(true);
                setShowLoadingIndicator(false);
              }
            },
          );
    }, [subGenre, favourite, favs]),
  );

  const loadNextPage = async () => {
    let result: Book[];
    if (favourite || page === maxPageNumber) {
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
      <Row proportion={1}>
        <Col verticalAlign={'flex-start'}>
          <Row proportion={1}>
            <Col>
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
                  favourite
                    ? isEmpty(subGenre?.nameEn)
                      ? msgs.newArrivals
                      : language === 'en'
                      ? subGenre.nameEn
                      : subGenre.nameAr
                    : msgs.favourite
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
                        navigation.navigate('bookDetailsScreen', {id: item._id})
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
                <>
                  <ActivityIndicator
                    animating={isShowLoadingIndicator}
                    color={theme.onBackground}
                  />
                  <Text
                    testID={'noResultFound'}
                    text={msgs.noBooksAvailable}
                    align="center"
                    display={isShowNoBooksTxt}
                    mediumEmphasis
                  />
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <SnackBar
                visible={isSnackBarVisible}
                onDismiss={setSnackBarVisible}
                msg={snackBarMsg}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Grid>
  );
}

const styles = StyleSheet.create({
  centerSelf: {alignSelf: 'center'},
  boldText: {fontWeight: 'bold'},
});
