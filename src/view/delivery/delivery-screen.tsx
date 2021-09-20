import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useContext, useState} from 'react';
import {Address} from 'zenbaei-js-lib/types';
import {Grid, Row, Col, Text, Card} from 'zenbaei-js-lib/react';
import {NavigationProps} from 'zenbaei-js-lib/react/types/navigation-props';
import {NavigationScreens} from 'constants/navigation-screens';
import {userService} from 'domain/user/user-service';
import {UserContext} from 'user-context';
import {getDistrictCharge} from 'view/address/address-actions';
import {currency} from '../../../app.config';
import {inspectDeliveryDate} from './delivery-actions';

export const DeliveryScreen = ({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'deliveryScreen'>) => {
  const [address, setAddress] = useState({} as Address);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    {} as {from: Date; to: Date},
  );
  const [phoneNo, setPhoneNo] = useState('');
  const [additionalPhoneNo, setAdditionalPhoneNo] = useState('');
  const {msgs, theme} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      userService.findOne('email', global.user.email).then((usr) => {
        const ad = usr.addresses.find((a) => a.default);
        setAddress(ad as Address);
        setPhoneNo(usr.phoneNo);
        setAdditionalPhoneNo(usr.additionalPhoneNo);
        getDistrictCharge(ad as Address).then((charge) =>
          setDeliveryCharge(charge),
        );
        Date;
        setExpectedDeliveryDate(inspectDeliveryDate());
      });
    }, []),
  );

  return (
    <Grid>
      <Row proportion={9}>
        <Col>
          <Card width="100%">
            <Text text={msgs.address} color={theme.secondary} bold />
            <Text
              align={'left'}
              text={`${address.street}, ${address.building}, ${address.apartment}`}
            />
            <Text text={msgs.phoneNo} color={theme.secondary} bold />
            <Text text={phoneNo} />
            <Text text={msgs.additionalPhoneNo} color={theme.secondary} bold />
            <Text text={additionalPhoneNo} />
            <Text
              text={`${msgs.expectedDeliveryDate} ${msgs.between} ${expectedDeliveryDate.from} ${msgs.and} ${expectedDeliveryDate.to}`}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Text text={msgs.paymentMethod} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text
            align={'right'}
            text={`${msgs.cart}: ${route.params.cartTotalPrice}`}
            color={theme.secondary}
          />
          <Text
            align={'right'}
            text={`${msgs.deliveryCharge}: ${deliveryCharge}`}
            color={theme.secondary}
          />
          <Text
            align="right"
            text="     "
            line={'underline'}
            color={theme.secondary}
          />
          <Text
            color={theme.secondary}
            align="right"
            text={`${msgs.total}: ${
              route.params.cartTotalPrice + deliveryCharge
            } ${currency}`}
          />
        </Col>
      </Row>
    </Grid>
  );
};
