import {imagesNames, staticFileUrl} from '../../app.config';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext} from 'react';
import {FlatList, Image, useWindowDimensions, View} from 'react-native';
import {Ctx, Fab, NavigationProps} from 'zenbaei-js-lib/react';

export function LookInsideBookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'lookInsideBookScreen'>) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const imageFolderName = route.params.imageFolderName;
  const {theme} = useContext(Ctx);

  return (
    <FlatList
      data={imagesNames}
      keyExtractor={(item) => item}
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
              borderColor: theme.primary,
            }}>
            <Image
              source={{uri: `${staticFileUrl}/${imageFolderName}/${item}`}}
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
              onPress={() => {}}
            />
          </View>
        );
      }}
    />
  );
}
