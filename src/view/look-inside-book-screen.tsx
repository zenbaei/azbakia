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
      renderItem={({item}) => {
        return (
          <>
            <Image
              source={{uri: `${staticFileUrl}/${imageFolderName}/${item}`}}
              style={{
                width: '50%',
                height: '50%',
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
          </>
        );
      }}
    />
  );
}
