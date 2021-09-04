import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext, useState} from 'react';
import {
  Grid,
  NavigationProps,
  Text,
  Link,
  Ctx,
  Row,
} from 'zenbaei-js-lib/react';
import {View} from 'react-native';
import {Book} from 'domain/book/book';
import {getStyles} from 'constants/styles';
import {getMessages} from 'constants/in18/messages-interface';
import {BookComponent} from 'component/book-component';
import Snackbar from 'react-native-paper/src/components/Snackbar';

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const [book, setBook] = useState(route.params);
  const viewDirection = book.language === 'ar' ? 'flex-end' : 'flex-start';
  const {theme, language} = useContext(Ctx);
  const styles = getStyles(theme);
  const msgs = getMessages(language);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);

  return (
    <Grid>
      <Row>
        <BookComponent
          book={book}
          showSnackBar={(msg) => {
            setSnackBarVisible(true);
            setSnackBarMsg(msg);
          }}
          replaceDisplayedBook={(bk) => setBook(bk)}
        />
        <View style={styles.wide}>
          <Link
            style={{alignSelf: 'center'}}
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
      </Row>
    </Grid>
  );
}
