import {useFocusEffect} from '@react-navigation/core';
import {Order} from 'domain/order/order';
import {orderService} from 'domain/order/order-service';
import React, {useCallback, useContext, useState} from 'react';
import {Image} from 'react-native';
import {UserContext} from 'user-context';
import {Card, Col, Grid, Row} from 'zenbaei-js-lib/react';
import {staticFileUrl} from '../../../app.config';

export const OrderScreen = () => {
  const [orders, setOrders] = useState([] as Order[]);
  const {styles, imgFileNames} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      orderService
        .findAll({email: global.user.email})
        .then((o) => setOrders(o));
    }, []),
  );

  return (
    <>
      <Grid>
        <Row>
          <Col>
            {orders.map((o) => {
              <Card>
                <Image
                  source={{
                    uri: `${staticFileUrl}/${o.item.imgFolderName}/${imgFileNames[0]}`,
                  }}
                  style={styles.image}
                />
              </Card>;
            })}
          </Col>
        </Row>
      </Grid>
    </>
  );
};
