import {staticFileUrl} from '../../app.config';
import {NavigationScreens} from 'constants/navigation-screens';
import React from 'react';
import {FlatList, Image, useWindowDimensions, View} from 'react-native';
import {Fab, NavigationProps} from 'zenbaei-js-lib/react';

export function BookImageScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'bookImageScreen'>) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.name}
      horizontal
      style={{position: 'absolute', display: visible ? 'flex' : 'none'}}
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
              source={{uri: `${staticFileUrl}/bokhary/${item.name}`}}
              style={{
                height: windowHeight,
                width: windowWidth - 30,
              }}
            />
            <Fab
              style={{
                alignSelf: 'flex-end',
                right: 20,
              }}
              small
              onPress={() => navigation.navigate('bookDetailsScreen')}
            />
          </View>
        );
      }}
    />
  );
}
