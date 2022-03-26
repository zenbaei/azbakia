import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext, useState} from 'react';
import {
  Grid,
  NavigationProps,
  Text,
  Link,
  Row,
  Col,
  SnackBar,
} from 'zenbaei-js-lib/react';
import {View, ImageURISource} from 'react-native';
import {getStyles} from 'constants/styles';
import {getMessages} from 'constants/in18/messages-interface';
import {ProductComponent} from 'view/product/product-component';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'user-context';
import {Product} from 'domain/product/product';
import {getFileNames} from 'zenbaei-js-lib/utils';
import {IMAGE_DIR, SERVER_URL, STATIC_FILES_URL} from 'app-config';
import {ImagesGallery} from 'view/image-gallery';
import ImageSlider from 'view/image-slider';
import {url} from 'inspector';

export function ProductDetailsScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'productDetailsScreen'>) {
  const [product, setProduct] = useState({} as Product);
  const {theme, language, cart} = useContext(UserContext);
  const styles = getStyles(theme);
  const msgs = getMessages(language);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [imagesUrl, setImagesUrl] = useState([] as string[]);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.details);
      setProduct(route.params.product);
      getFileNames(`${IMAGE_DIR}/${route.params.product.uuid}`).then((res) =>
        setImagesUrl(res.files),
      );
    }, [msgs, route.params.product]),
  );

  useFocusEffect(
    useCallback(() => {
      global.setDisplayCartBtn(cart.products);
    }, [cart]),
  );

  const textDirection = (): 'left' | 'right' => {
    return product.language === 'ar' ? 'right' : 'left';
  };

  return (
    <>
      <Grid>
        <Row>
          <Col>
            {imagesUrl.length > 0 ? (
              <ImageSlider images={toImagesURI(imagesUrl, product.uuid)} />
            ) : (
              <></>
            )}
            <Text
              bold
              align={textDirection()}
              style={styles.bold}
              text={`${msgs.description}:`}
            />
            <Text align={textDirection()} text={product.description} />
          </Col>
        </Row>
      </Grid>

      <SnackBar
        visible={isSnackBarVisible}
        onDismiss={setSnackBarVisible}
        msg={snackBarMsg}
      />
    </>
  );
}

const toImagesGallery = (images: string[], directory: string) => {
  return images.map((i, idx) => ({
    id: idx,
    url: `${STATIC_FILES_URL}/${directory}/${i}`,
  }));
};

const toImagesURI = (images: string[], directory: string): ImageURISource[] => {
  return images.map((i) => ({
    uri: `${STATIC_FILES_URL}/${directory}/${i}`,
  }));
};
