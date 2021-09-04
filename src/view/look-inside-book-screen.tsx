import {imagesNames, staticFileUrl} from '../../app.config';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useContext} from 'react';
import {Alert, FlatList, Image, View} from 'react-native';
import {Ctx, NavigationProps} from 'zenbaei-js-lib/react';
import {FAB, IconButton} from 'react-native-paper';

export function LookInsideBookScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'lookInsideBookScreen'>) {
  const imageFolderName = route.params.imageFolderName;
  const {theme} = useContext(Ctx);

  const BookInside = ({item}: {item: string[]}) => {
    return (
      <View
        style={{
          borderRadius: 10,
          borderColor: theme.secondary,
          borderWidth: 2,
          margin: 5,
          padding: 5,
        }}>
        <IconButton
          color={theme.primary}
          icon={'close'}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            position: 'absolute',
            backgroundColor: theme.secondary,
            alignSelf: 'flex-end',
            top: 20,
            right: 20,
            zIndex: 100,
          }}
        />
        <Image
          style={{
            height: '100%',
            resizeMode: 'stretch',
            aspectRatio: 1 / 2,
          }}
          source={{uri: `${staticFileUrl}/${imageFolderName}/${item}`}}
        />
      </View>
    );
  };

  return (
    <View style={{alignSelf: 'center'}}>
      <FlatList
        data={imagesNames}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({item}) => <BookInside item={item} />}
      />
    </View>
  );
}
