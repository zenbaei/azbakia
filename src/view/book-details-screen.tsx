import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext} from 'react';
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

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const book: Book = route.params;
  const viewDirection = book.language === 'ar' ? 'flex-end' : 'flex-start';
  const {theme, language} = useContext(Ctx);
  const styles = getStyles(theme);
  const msgs = getMessages(language);

  return (
    <Grid>
      <Row>
        <BookComponent book={book} />
        <View style={styles.wide}>
          <Link
            style={{alignSelf: 'center'}}
            label={msgs.lookInside}
            onPress={() =>
              navigation.navigate('lookInsideBookScreen', {
                imageFolderName: book.name, //book.imageFolderName
              })
            }
          />
        </View>

        <View style={{alignItems: viewDirection}}>
          <Text style={styles.bold} text={`${msgs.description}:`} />
          <Text text={book.description} />
        </View>
      </Row>
    </Grid>
  );
}
