import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import {Book} from 'domain/book/book';
import React, {useCallback, useContext, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {UserContext} from 'user-context';
import {
  Col,
  Grid,
  NavigationProps,
  Row,
  SnackBar,
  Text,
} from 'zenbaei-js-lib/react';
import {BookComponent} from './book-component';
import {findFavouriteBooks} from './book-screen-actions';

export function FavouriteScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'favouriteScreen'>) {
  const {favs, msgs, theme, cart} = useContext(UserContext);
  const [books, setBooks] = useState([] as Book[]);
  const [isShowLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [isShowNoBooksTxt, setShowNoBooksTxt] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.favourite);
      cart.length > 0
        ? global.setDisplayCartBtn('flex')
        : global.setDisplayCartBtn('none');
      if (favs && favs.length > 0) {
        setShowLoadingIndicator(true);
        setShowNoBooksTxt(false);
        findFavouriteBooks(favs).then((bks) => {
          setBooks(bks);
          setShowLoadingIndicator(false);
        });
      } else {
        setBooks([] as Book[]);
        setShowNoBooksTxt(true);
      }
    }, [favs, msgs, cart]),
  );

  return (
    <>
      <Grid>
        <Row>
          <Col>
            {books?.length > 0 ? (
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
            ) : (
              <>
                <ActivityIndicator
                  animating={isShowLoadingIndicator}
                  color={theme.secondary}
                />
                <Text
                  text={msgs.noFavBooks}
                  align="center"
                  visible={isShowNoBooksTxt}
                  mediumEmphasis
                />
              </>
            )}
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
