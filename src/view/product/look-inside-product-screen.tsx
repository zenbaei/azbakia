import {STATIC_FILES_URL} from '../../app-config';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {NavigationProps} from 'zenbaei-js-lib/react';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'user-context';
import IconButton from 'react-native-paper/src/components/IconButton';

export function LookInsideProductScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'lookInsideProductScreen'>) {
  const imageFolderName = route.params.imageFolderName;
  const {theme, msgs, styles, cart, imgFileNames} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.lookInside);
      global.setDisplayCartBtn(cart);
    }, [msgs, cart]),
  );

  const InsideBook = ({item}: {item: string}) => {
    return (
      <View style={styles.lookInsideImgFrame}>
        <IconButton
          color={theme.primary}
          icon="close"
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.closeImgIcon}
        />
        <Image
          style={styles.lookInsideImg}
          source={{uri: `${STATIC_FILES_URL}/${imageFolderName}/${item}`}}
        />
      </View>
    );
  };

  return (
    <View style={inlineStyles.view}>
      <FlatList
        data={imgFileNames}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({item}) => <InsideBook item={item} />}
      />
    </View>
  );
}

const inlineStyles = StyleSheet.create({
  view: {alignSelf: 'center'},
});
