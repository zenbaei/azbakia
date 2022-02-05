import {SERVER_URL} from '../../app-config';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext, useState} from 'react';
import {ActivityIndicator, FlatList, Image, View} from 'react-native';
import {NavigationProps} from 'zenbaei-js-lib/react';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'user-context';
import IconButton from 'react-native-paper/src/components/IconButton';

export function ProductImagesScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'productImagesScreen'>) {
  const {theme, msgs, styles, cart} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.details);
      global.setDisplayCartBtn(cart.products);
    }, [msgs, cart]),
  );

  const ImageFrame = ({imgUrl}: {imgUrl: string}) => {
    const [loading, setLoading] = useState(true);
    return (
      <View style={styles.imageFrame}>
        <IconButton
          color={theme.primary}
          icon="close"
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.closeImgIcon}
        />
        <ActivityIndicator
          style={styles.centerLoading}
          animating={loading}
          color={theme.secondary}
        />
        <Image
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={styles.fullScreenImage}
          source={{uri: `${SERVER_URL}${imgUrl}`}}
        />
      </View>
    );
  };

  return (
    <View style={styles.fullScreenImagesContainer}>
      <FlatList
        data={route.params.imagesUrl}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({item}) => <ImageFrame imgUrl={item} />}
      />
    </View>
  );
}
