import {Product} from 'domain/product/product';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {
  Grid,
  NavigationProps,
  Text,
  Row,
  Col,
  SearchBar,
  SnackBar,
} from 'zenbaei-js-lib/react';
import {NavigationScreens} from 'constants/navigation-screens';
import {
  findProduct,
  findProductsByPage,
  findSearchedProductsByPage,
  find1stSearchedProductsPageAndPageSize,
  findSearchedProductsProjected,
  find1stProductsPageAndPageSize,
} from './product-screen-actions';
import {UserContext} from 'user-context';
import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'zenbaei-js-lib/utils';
import ActivityIndicator from 'react-native-paper/src/components/ActivityIndicator';
import {ProductComponent} from 'view/product/product-component';
import {Loading} from 'view/loading-component';

export function ProductScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'productScreen'>) {
  const [books, setBooks] = useState([] as Product[]);
  const subGenre = route.params?.subGenre;
  const [page, setPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(1);
  const {cart, msgs, theme, language, pageSize} = useContext(UserContext);
  const [animating, setAnimating] = useState(false);
  const [isShowLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const minSearchTextLength: number = 2;

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.home);
      global.setDisplayCartBtn(cart);
    }, [msgs, cart]),
  );

  const findFirstPageProducts = useCallback(() => {
    setShowLoadingIndicator(true);
    find1stProductsPageAndPageSize(
      cart,
      subGenre?.enName,
      pageSize,
      (result, totalPagesNumber) => {
        setMaxPageNumber(totalPagesNumber);
        setBooks(result);
        setPage(1);
      },
    );
  }, [cart, subGenre, pageSize]);

  useFocusEffect(
    useCallback(() => {
      findFirstPageProducts();
    }, [findFirstPageProducts]),
  );

  const loadNextPage = async () => {
    let result: Product[];
    if (page === maxPageNumber) {
      return;
    }
    setAnimating(true);
    if (searchToken.length > 0) {
      result = await findSearchedProductsByPage(searchToken, page, pageSize);
    } else {
      const bks = await findProductsByPage(
        cart,
        subGenre?.enName,
        page,
        pageSize,
      );
      result = [...books, ...bks];
    }
    setBooks(result);
    setPage(page + 1);
    setAnimating(false);
  };

  const onBlurSearch = async (text: string) => {
    setShowLoadingIndicator(true);
    setSearchToken(text);
    find1stSearchedProductsPageAndPageSize(
      text,
      pageSize,
      (result, totalPagesNumber) => {
        setBooks(result);
        setMaxPageNumber(totalPagesNumber);
        setPage(1);
      },
    );
  };

  const search = async (text: string) => {
    const result = await findSearchedProductsProjected(text);
    return result.map((bk) => ({value: bk._id, label: bk.name}));
  };

  const _updateDisplayedProduct = (book: Product) => {
    const bks = books.map((bk) => (bk._id === book._id ? book : bk));
    setBooks(bks);
  };

  const renderFooter = () => {
    return <ActivityIndicator animating={animating} color={theme.secondary} />;
  };

  return (
    <>
      <Grid testID="grid">
        <Row proportion={1}>
          <Col verticalAlign={'flex-start'}>
            <SearchBar
              minLength={minSearchTextLength}
              onChangeText={search}
              onSelectItem={async (id: string) => {
                const book = await findProduct(id);
                setBooks([book]);
              }}
              onBlur={onBlurSearch}
              onClear={findFirstPageProducts}
            />
            <Text
              bold
              color={theme.secondary}
              text={
                isEmpty(subGenre?.enName)
                  ? msgs.newArrivals
                  : language === 'en'
                  ? subGenre.enName
                  : subGenre.arName
              }
              align="center"
            />
            <Loading
              visible={books?.length < 1}
              showLoading={isShowLoadingIndicator}
              text={msgs.noBooksAvailable}
            />
            <FlatList
              testID="flatList"
              scrollEnabled
              numColumns={2}
              data={books}
              keyExtractor={(item) => item._id}
              onEndReached={loadNextPage}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              renderItem={({item}) => (
                <ProductComponent
                  product={item}
                  onPressImg={() =>
                    navigation.navigate('productDetailsScreen', {id: item._id})
                  }
                  updateDisplayedProduct={(book: Product) => {
                    _updateDisplayedProduct(book);
                  }}
                  showSnackBar={(msg) => {
                    setSnackBarVisible(true);
                    setSnackBarMsg(msg);
                  }}
                />
              )}
            />
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
