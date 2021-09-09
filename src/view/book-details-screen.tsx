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
import {View} from 'react-native';
import {getStyles} from 'constants/styles';
import {getMessages} from 'constants/in18/messages-interface';
import {BookComponent} from 'component/book-component';
import Snackbar from 'react-native-paper/src/components/Snackbar';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'user-context';

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const [book, setBook] = useState(route.params);
  const viewDirection = book.language === 'ar' ? 'flex-end' : 'flex-start';
  const {theme, language, cart} = useContext(UserContext);
  const styles = getStyles(theme);
  const msgs = getMessages(language);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.bookDetails);
      setBook(route.params);
    }, [msgs, route.params]),
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

          <View style={{alignItems: viewDirection}}>
            <Text style={styles.bold} text={`${msgs.description}:`} />
            <Text text={book.description} />
          </View>

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
