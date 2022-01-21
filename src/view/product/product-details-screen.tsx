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
import {View} from 'react-native';
import {getStyles} from 'constants/styles';
import {getMessages} from 'constants/in18/messages-interface';
import {ProductComponent} from 'view/product/product-component';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'user-context';
import {Product} from 'domain/product/product';

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
      setImagesUrl(route.params.imagesUrl);
      setProduct(route.params.product);
    }, [msgs, route.params.product, route.params.imagesUrl]),
  );

  useFocusEffect(
    useCallback(() => {
      global.setDisplayCartBtn(cart);
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
            <ProductComponent
              centerCard
              product={product}
              showSnackBar={(msg) => {
                setSnackBarVisible(true);
                setSnackBarMsg(msg);
              }}
              updateDisplayedProduct={(pd) => setProduct(pd)}
            />
            <View style={styles.wide}>
              <Link
                align="center"
                label={msgs.moreImages}
                onPress={() =>
                  navigation.navigate('productImagesScreen', {
                    imagesUrl: imagesUrl,
                  })
                }
              />
            </View>

            <Text
              bold
              color={theme.secondary}
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
