import {NavigationScreens} from 'constants/navigation-screens';
import React from 'react';
import {Grid, NavigationProps, Text, Col, Fab} from 'zenbaei-js-lib/react';
import {Image, StyleSheet, View} from 'react-native';
import {staticFileUrl} from '../../app.config';
import {Book} from 'book/book';
import {getMessages} from 'constants/in18/messages';
import IconButton from 'react-native-paper/src/components/IconButton';
import {getAppTheme} from 'zenbaei-js-lib/theme';

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const book: Book = route.params;

  return (
    <Grid>
      <Col>
        <View
          style={{
            width: 155,
            alignSelf: 'center',
            borderColor: getAppTheme().onSurface,
            borderWidth: 1,
            borderRadius: 2,
          }}>
          <Image
            source={{uri: `${staticFileUrl}/${book.name}/main.jpg`}}
            style={{height: 150, width: 150}}
          />
          <Fab
            style={styles.fab}
            icon="magnify-plus-outline"
            onPress={() => navigation.navigate('bookImageScreen')}
          />
        </View>
        <IconButton
          icon="heart-outline"
          onPress={() => console.log('pressed')}
        />
        <Fab icon="cart-outline" onPress={() => console.log('pressed')} />

        <View style={{alignItems: 'flex-end'}}>
          <Text style={{fontWeight: 'bold'}} text={`${getMessages().price}:`} />
          <Text text={book.price} />
          <Text
            style={{fontWeight: 'bold'}}
            text={`${getMessages().description}:`}
          />
          <Text text={book.description} />
        </View>
      </Col>
    </Grid>
  );
}
const _renderItem = ({item, index}) => {
  return (
    <>
      <Image
        source={{uri: `${staticFileUrl}/bokhary/${item.name}`}}
        style={{height: 150, width: 150}}
      />
    </>
  );
};
const images = [
  {name: 'main.jpg'},
  {name: '1.png'},
  {name: '2.png'},
  {name: '3.png'},
];

/*
 <>
                <Image
                  source={{uri: `${fileServerUrl}/bokary/${img}.png`}}
                  style={{height: 150, width: 150}}
                />
                <Text text={`${fileServerUrl}/bokary/${img.name}.png`} />
              </>
            */
const styles = StyleSheet.create({
  frame: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    margin: 2,
  },
  fab: {
    bottom: 5,
    right: 5,
  },
});
