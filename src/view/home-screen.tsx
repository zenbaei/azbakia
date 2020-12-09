import {fileServerUrl} from 'app.config';
import {Book} from 'book/book';
import {findAll} from 'book/book-service';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {Col, Grid, Text, DataGrid} from 'zenbaei-js-lib/react';

export function HomeScreen() {
  // eslint-disable-next-line no-array-constructor
  const [books, setBooks] = useState(new Array<Book>());

  useEffect(() => {
    findAll({newArrival: true}).then((bks) => {
      const arr: Book[] = bks ? bks : [];
      setBooks(arr);
    });
  }, []);

  return (
    <Grid>
      <Col id="1">
        <ScrollView>
          <DataGrid
            data={books}
            recordPerRow={2}
            renderRecord={(element: Book, index: number) => {
              return (
                <View key={index}>
                  <Image
                    source={{uri: `${fileServerUrl}/${element.imageName}`}}
                    style={{height: 100, width: 100}}
                  />
                  <Text text={element.name} />
                </View>
              );
            }}
          />
        </ScrollView>
      </Col>
    </Grid>
  );
}
