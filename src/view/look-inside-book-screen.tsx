import {staticFileUrl} from '../../app.config';
import {NavigationScreens} from 'constants/navigation-screens';
import React from 'react';
import {FlatList, Image, useWindowDimensions, View} from 'react-native';
import {Fab, NavigationProps} from 'zenbaei-js-lib/react';
import {getAppTheme} from 'zenbaei-js-lib/theme';

export function LookInsideBookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'lookInsideBookScreen'>) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const imageFolderName = route.params.imageFolderName;

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.name}
      horizontal
      style={{position: 'absolute'}}
      renderItem={({item}) => {
        return (
          <View
            style={{
              width: windowWidth - 20,
              padding: 10,
              borderRadius: 2,
              marginRight: 10,
              borderWidth: 4,
              borderColor: getAppTheme().primary,
            }}>
            <Image
              source={{uri: `${staticFileUrl}/${imageFolderName}/${item.name}`}}
              style={{
                height: windowHeight,
                width: windowWidth - 30,
              }}
            />
            <Fab
              icon="close"
              style={{
                alignSelf: 'flex-end',
                right: 20,
              }}
              onPress={() => navigation.navigate('bookDetailsScreen')}
            />
          </View>
        );
      }}
    />
  );
}

const images = [
  {name: 'main.jpg'},
  {name: '1.png'},
  {name: '2.png'},
  {name: '3.png'},
];
