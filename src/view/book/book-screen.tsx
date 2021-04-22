import {pageSize} from '../../../app.config';
import {Book} from 'domain/book/book';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {Grid, NavigationProps, Text, Row} from 'zenbaei-js-lib/react';
import {NavigationScreens} from 'constants/navigation-screens';
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

  useFocusEffect(
    useCallback(() => {
      cart.length > 0
        ? global.setDisplayCartBtn('flex')
        : global.setDisplayCartBtn('none');
      calculateMaxPageSize(subGenre).then((val) => setMaxPageSize(val));
      _loadBooks();
    }, [subGenre, cart]),
  );

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.home);
    }, [msgs.home]),
  );

  const navigateToBookDetails = (book: Book) => {
    navigation.navigate('bookDetailsScreen', book);
  };

  const _loadBooks = () => {
    if (page > maxPageSize) {
      return;
    }
    setAnimating(true);
    loadBooks(subGenre?.nameEn, page * pageSize, pageSize).then((bks) => {
      const arr = page === 0 ? bks : [...books, ...bks];
      setBooks(arr);
      setPage(page + 1);
      setAnimating(false);
    });
  };

  const renderFooter = () => {
    return (
      <ActivityIndicator animating={animating} color={theme.onBackground} />
    );
  };

  return (
    <Grid>
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
        <FlatList
          style={{alignSelf: 'center'}}
          scrollEnabled
          numColumns={2}
          data={books}
          keyExtractor={(item) => item.name}
          onEndReached={_loadBooks}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          renderItem={({item}) => (
            <BookComponent book={item} onPressImg={navigateToBookDetails} />
          )}
        />
      </Row>
    </Grid>
  );
}
