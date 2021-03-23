import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext} from 'react';
import {
  Grid,
  NavigationProps,
  Text,
  Col,
  Fab,
  Card,
  Link,
  Ctx,
} from 'zenbaei-js-lib/react';
import {Image, View} from 'react-native';
import {staticFileUrl} from '../../app.config';
import {Book} from 'domain/book/book';
import {getMessages} from 'constants/in18/messages';
import {getStyles} from 'constants/styles';

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const book: Book = route.params;
  const viewDirection = book.language === 'ar' ? 'flex-end' : 'flex-start';
  const {theme} = useContext(Ctx);
  const styles = getStyles(theme);
  return (
    <Grid>
      <Col>
        <Card width="50%">
          <Image
            source={{uri: `${staticFileUrl}/${book.name}/main.jpg`}}
            style={styles.image}
          />
          <Fab
            icon="heart-outline"
            style={styles.fav}
            onPress={() => console.log('Pressed')}
          />
          <Fab
            icon="cart-outline"
            style={styles.cart}
            onPress={() => {
              //addToCart(book);
            }}
          />
          <View style={styles.wide}>
            <Link
              style={{alignSelf: 'center'}}
              label={getMessages().lookInside}
              onPress={() =>
                navigation.navigate('lookInsideBookScreen', {
                  imageFolderName: book.name, //book.imageFolderName
                })
              }
            />
            <Text style={{...styles.bold, ...styles.price}} text={book.price} />
          </View>
        </Card>

        <View style={{alignItems: viewDirection}}>
          <Text style={styles.bold} text={`${getMessages().description}:`} />
          <Text text={book.description} />
        </View>
      </Col>
    </Grid>
  );
}
