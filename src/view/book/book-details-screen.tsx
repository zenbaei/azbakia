import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext, useState} from 'react';
import {
  Grid,
  NavigationProps,
  Text,
  Link,
  Row,
  Col,
} from 'zenbaei-js-lib/react';
import {FlexAlignType, View} from 'react-native';
import {getStyles} from 'constants/styles';
import {getMessages} from 'constants/in18/messages-interface';
import {BookComponent} from 'view/book/book-component';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'user-context';
import {bookService} from 'domain/book/book-service';
import {Book} from 'domain/book/book';

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const [book, setBook] = useState({} as Book);
  const [viewDirection, setViewDirection] = useState(
    'flex-start' as FlexAlignType,
  );
  const {theme, language, cart} = useContext(UserContext);
  const styles = getStyles(theme);
  const msgs = getMessages(language);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.bookDetails);
      bookService.findOne('_id', route.params.id).then((bk) => {
        setBook(bk);
        setViewDirection(bk.language === 'ar' ? 'flex-end' : 'flex-start');
      });
    }, [msgs, route.params.id]),
  );

  useFocusEffect(
    useCallback(() => {
      cart.length > 0
        ? global.setDisplayCartBtn('flex')
        : global.setDisplayCartBtn('none');
    }, [cart.length]),
  );

  return (
    <Grid>
      <Row>
        <Col>
          <BookComponent
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
                  imageFolderName: book.imageFolderName,
                })
              }
            />
          </View>

          <Text
            bold
            color={theme.secondary}
            align="left"
            style={styles.bold}
            text={`${msgs.description}:`}
          />
          <Text align="left" text={book.description} />

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
