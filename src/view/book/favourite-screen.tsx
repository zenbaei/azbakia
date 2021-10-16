import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import {Book} from 'domain/book/book';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {UserContext} from 'user-context';
import {Loading} from 'view/loading-component';
import {Col, Grid, NavigationProps, Row, SnackBar} from 'zenbaei-js-lib/react';
import {BookComponent} from './book-component';
import {findFavouriteBooks} from './book-screen-actions';

export function FavouriteScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'favouriteScreen'>) {
  const {favs, msgs, cart} = useContext(UserContext);
  const [books, setBooks] = useState([] as Book[]);
  const [isShowLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setBooks([] as Book[]);
      global.setAppBarTitle(msgs.favourite);
      global.setDisplayCartBtn(cart);
      if (favs?.length > 0) {
        setShowLoadingIndicator(true);
        findFavouriteBooks(favs).then((bks) => {
          setBooks(bks);
          setShowLoadingIndicator(false);
        });
      }
    }, [favs, msgs, cart]),
  );

  return (
    <>
      <Loading
        visible={books?.length < 1}
        showLoading={isShowLoadingIndicator}
        text={msgs.noFavBooks}
      />
      <Grid>
        <Row>
          <Col>
            <FlatList
              testID="flatList"
              scrollEnabled
              numColumns={2}
              data={books}
              keyExtractor={(item) => item._id}
              renderItem={({item}) => (
                <BookComponent
                  book={item}
                  onPressImg={() =>
                    navigation.navigate('bookDetailsScreen', {id: item._id})
                  }
                  updateDisplayedBook={() => {}}
                  showSnackBar={(msg) => {
                    setSnackBarVisible(true);
                    setSnackBarMsg(msg);
                  }}
                />
              )}
            />
          </Col>
        </Row>
      </Grid>
      <SnackBar
        msg={snackBarMsg}
        onDismiss={setSnackBarVisible}
        visible={isSnackBarVisible}
      />
    </>
  );
}
