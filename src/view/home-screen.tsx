import {fileServerUrl} from 'app.config';
import {Book} from 'book/book';
import {BookService} from 'book/book-service';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Col, Grid, Text, DataGrid, NavigationProps} from 'zenbaei-js-lib/react';
import {FAB} from 'react-native-paper/src/components/FAB/FAB';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import {NavigationScreens} from 'constants/navigation-screens';

export function HomeScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'homeScreen'>) {
  // eslint-disable-next-line no-array-constructor
  const [books, setBooks] = useState(new Array<Book>());
  useEffect(() => {
    bookService.getByQuery({newArrival: true}).then((bks) => {
      const arr: Book[] = bks ? bks : [];
      setBooks(arr);
    });
  }, []);

  const navToBookDetails = (book: Book) => {
    //bookService.getByUnique('_id', book._id);
    navigation.navigate('bookDetailsScreen', book);
  };

  return (
    <Grid>
      <Col>
        <ScrollView>
          <DataGrid
            data={books}
            columns={2}
            renderItem={(book: Book, _index: number) => {
              return (
                <View key={book.name + 'vew'} style={styles.frame}>
                  <TouchableHighlight
                    key={book.name + 'toh'}
                    onPress={() => {
                      navToBookDetails(book);
                    }}>
                    <Image
                      source={{uri: `${fileServerUrl}/${book.name}/main.jpg`}}
                      style={{height: 150, width: 150}}
                    />
                  </TouchableHighlight>
                  <FAB
                    style={styles.fab}
                    small
                    icon="heart-outline"
                    onPress={() => console.log('Pressed')}
                  />
                  <FAB
                    style={styles.cart}
                    small
                    icon="cart-outline"
                    onPress={() => console.log('Pressed')}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight: 'bold'}} text={book.name} />
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      </Col>
    </Grid>
  );
}

const bookService: BookService = new BookService();

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.onSurface,
    borderRadius: 5,
    margin: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 60,
    backgroundColor: DarkTheme.surface,
  },
  cart: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 10,
    backgroundColor: DarkTheme.surface,
  },
});
