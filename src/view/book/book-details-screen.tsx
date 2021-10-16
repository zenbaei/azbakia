import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext, useState} from 'react';
import {
  Grid,
  NavigationProps,
  Text,
  Link,
  Row,
  Col,
  SnackBar,
} from 'zenbaei-js-lib/react';
import {View} from 'react-native';
import {getStyles} from 'constants/styles';
import {getMessages} from 'constants/in18/messages-interface';
import {BookComponent} from 'view/book/book-component';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'user-context';
import {bookService} from 'domain/book/book-service';
import {Book} from 'domain/book/book';

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const [book, setBook] = useState({} as Book);
  const {theme, language, cart} = useContext(UserContext);
  const styles = getStyles(theme);
  const msgs = getMessages(language);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.bookDetails);
      bookService.findOne('_id', route.params.id).then((bk) => setBook(bk));
    }, [msgs, route.params.id]),
  );

  useFocusEffect(
    useCallback(() => {
      global.setDisplayCartBtn(cart);
    }, [cart]),
  );

  const textDirection = (): 'left' | 'right' => {
    return book.language === 'ar' ? 'right' : 'left';
  };

  return (
    <>
      <Grid>
        <Row>
          <Col>
            <BookComponent
              centerCard
              book={book}
              showSnackBar={(msg) => {
                setSnackBarVisible(true);
                setSnackBarMsg(msg);
              }}
              updateDisplayedBook={(bk) => setBook(bk)}
            />
            <View style={styles.wide}>
              <Link
                align="center"
                label={msgs.lookInside}
                onPress={() =>
                  navigation.navigate('lookInsideBookScreen', {
                    imageFolderName: book._id,
                  })
                }
              />
            </View>

            <Text
              bold
              color={theme.secondary}
              align={textDirection()}
              style={styles.bold}
              text={`${msgs.description}:`}
            />
            <Text align={textDirection()} text={book.description} />
          </Col>
        </Row>
      </Grid>

      <SnackBar
        visible={isSnackBarVisible}
        onDismiss={setSnackBarVisible}
        msg={snackBarMsg}
      />
    </>
  );
}
