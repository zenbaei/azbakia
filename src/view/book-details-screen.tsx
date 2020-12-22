import {NavigationScreens} from 'constants/navigation-screens';
import React, {useState} from 'react';
import {Grid, NavigationProps, Text, Col} from 'zenbaei-js-lib/react';
import Carousel from 'react-native-snap-carousel';
import {
  Image,
  StyleSheet,
  FlatList,
  View,
  useWindowDimensions,
} from 'react-native';
import {fileServerUrl} from 'app.config';
import {Book} from 'book/book';
import {getMessages} from 'constants/in18/messages';
import FAB from 'react-native-paper/src/components/FAB/FAB';
import {DarkTheme} from 'zenbaei-js-lib/constants';
import IconButton from 'react-native-paper/src/components/IconButton';

export function BookDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookDetailsScreen'>) {
  const book: Book = route.params;
  const [visible, isVisible] = useState(false);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return (
    <Grid>
      <Col>
        <View
          style={{
            width: 155,
            alignSelf: 'center',
            borderColor: DarkTheme.onSurface,
            borderWidth: 1,
            borderRadius: 2,
          }}>
          <Image
            source={{uri: `${fileServerUrl}/${book.name}/main.jpg`}}
            style={{height: 150, width: 150}}
          />
          <FAB
            style={styles.fab}
            small
            icon="magnify-plus-outline"
            onPress={() => isVisible(!visible)}
          />
        </View>
        <IconButton
          icon="heart-outline"
          onPress={() => console.log('pressed')}
        />
        <FAB small icon="cart-outline" onPress={() => console.log('pressed')} />

        <View style={{alignItems: 'flex-end'}}>
          <Text style={{fontWeight: 'bold'}} text={`${getMessages().price}:`} />
          <Text text={book.price} />
          <Text
            style={{fontWeight: 'bold'}}
            text={`${getMessages().description}:`}
          />
          <Text text={book.description} />
        </View>
        <FlatList
          data={images}
          keyExtractor={(item) => item.name}
          horizontal
          style={{position: 'relative', display: visible ? 'flex' : 'none'}}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  width: windowWidth - 20,
                  padding: 10,
                  borderRadius: 2,
                  marginRight: 10,
                  ...styles.frame,
                }}>
                <Image
                  source={{uri: `${fileServerUrl}/bokhary/${item.name}`}}
                  style={{
                    height: windowHeight,
                    width: windowWidth - 30,
                  }}
                />
                <FAB
                  style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    right: 20,
                    backgroundColor: DarkTheme.surface,
                  }}
                  small
                  icon="close"
                  onPress={() => isVisible(!visible)}
                />
              </View>
            );
          }}
        />
      </Col>
    </Grid>
  );
}
const _renderItem = ({item, index}) => {
  return (
    <>
      <Image
        source={{uri: `${fileServerUrl}/bokhary/${item.name}`}}
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
    borderColor: DarkTheme.onSurface,
    borderRadius: 5,
    margin: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: DarkTheme.surface,
  },
});
