import {IMAGE_DIR, SERVER_URL} from 'app-config';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Image} from 'react-native';
import {UserContext} from 'user-context';
import {getMainImageName} from 'zenbaei-js-lib/utils';

export const OrderItemImage = ({id}: {id: string}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(true);
  const {styles, theme} = useContext(UserContext);

  useEffect(() => {
    getMainImageName(`${IMAGE_DIR}/${id}`).then((res) => setImageUrl(res.file));
  }, [id]);

  return (
    <>
      <ActivityIndicator
        style={styles.centerLoading}
        animating={loadingImage}
        color={theme.secondary}
      />
      <Image
        onLoadStart={() => setLoadingImage(true)}
        onLoadEnd={() => setLoadingImage(false)}
        source={
          imageUrl
            ? {uri: `${SERVER_URL}${imageUrl}`}
            : require('../../resources/images/no-image.png')
        }
        style={styles.image}
      />
    </>
  );
};
