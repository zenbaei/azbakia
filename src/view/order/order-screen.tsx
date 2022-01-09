import {useFocusEffect} from '@react-navigation/core';
import {bookCardWidth} from 'constants/styles';
import {bookService} from 'domain/book/book-service';
import {Item, Order} from 'domain/order/order';
import {orderService} from 'domain/order/order-service';
import React, {useCallback, useContext, useState} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {UserContext} from 'user-context';
import {Alert} from 'view/alert-component';
import {formatDate} from 'view/delivery/delivery-actions';
import {LabelValue} from 'view/label-value-component';
import {Loading} from 'view/loading-component';
import {
  Button,
  Card,
  Col,
  Grid,
  Row,
  SnackBar,
  Text,
} from 'zenbaei-js-lib/react';
import {STATIC_FILES_URL} from '../../app-config';

export const OrderScreen = () => {
  const [orders, setOrders] = useState([] as Order[]);
  const {styles, imgFileNames, msgs} = useContext(UserContext);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const SPACE = '                 ';

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.orders);
      _findOrders();
    }, [msgs.orders]),
  );

  const _findOrders = () => {
    setShowLoading(true);
    orderService
      .findAll({email: global.user.email}, {sort: {date: -1}})
      .then((o) => {
        setOrders(o);
        setShowLoading(false);
      });
  };

  const cancel = (id: string, item: Item) => {
    if (item.status === 'pending' || item.status === 'processing') {
      Alert('', msgs.cancelConfirmation, msgs, () =>
        orderService.cancelItem(id, item.bookId).then((r) => {
          if (r.modified === 1) {
            _findOrders();
            setShowSnackBar(true);
            bookService.restoreInventory(item.bookId, item.quantity);
          }
        }),
      );
    } else {
      Alert('', msgs.cannotCancel);
    }
  };

  return (
    <>
      <Loading
        showLoading={showLoading}
        text={msgs.noOrders}
        visible={orders.length < 1}
      />
      <Grid>
        <Row>
          <Col>
            <ScrollView>
              {orders.map((o) => (
                <Card key={o._id} width="100%">
                  <LabelValue label={msgs.orderRef} value={o._id} />
                  <LabelValue
                    style={styles.marginBottom}
                    label={msgs.orderDate}
                    value={formatDate(o.date)}
                  />
                  {o.items.map((i) => (
                    <>
                      <View key={i.bookId} style={styles.viewRow}>
                        <Card width={bookCardWidth}>
                          <Image
                            source={{
                              uri: `${STATIC_FILES_URL}/${i.bookId}/${imgFileNames[0]}`,
                            }}
                            style={styles.image}
                          />
                        </Card>
                        <View
                          style={[
                            styles.flexCenter,
                            styles.labelViewContainer,
                            styles.columnCenterChildren,
                          ]}>
                          <LabelValue
                            align="center"
                            label={msgs.quantity}
                            value={i.quantity}
                          />
                          <LabelValue
                            align="center"
                            label={msgs.price}
                            value={i.price}
                          />
                          <LabelValue
                            align="center"
                            label={msgs.status}
                            value={i.status}
                          />
                          <Button
                            disabled={i.status === 'canceled'}
                            label={msgs.cancel}
                            onPress={() => cancel(o._id, i)}
                          />
                        </View>
                      </View>
                      <Text
                        key={i.bookId + i.bookId}
                        text={SPACE}
                        line="line-through"
                        mediumEmphasis
                      />
                    </>
                  ))}
                </Card>
              ))}
            </ScrollView>
          </Col>
        </Row>
      </Grid>
      <SnackBar
        msg={msgs.itemCanceled}
        visible={showSnackBar}
        onDismiss={setShowSnackBar}
      />
    </>
  );
};
