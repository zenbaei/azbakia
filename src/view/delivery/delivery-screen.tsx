import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useContext, useState} from 'react';
import {Address} from 'zenbaei-js-lib/types';
import {Grid, Row, Col, Text, Card, InputText} from 'zenbaei-js-lib/react';
import {NavigationProps} from 'zenbaei-js-lib/react/types/navigation-props';
import {NavigationScreens} from 'constants/navigation-screens';
import {userService} from 'domain/user/user-service';
import {UserContext} from 'user-context';
import {getDistrictCharge} from 'view/address/address-actions';
import {currency} from '../../../app.config';
import {DeliveryDateRange, inspectDeliveryDate} from './delivery-actions';
import moment from 'moment';
import {StyleSheet} from 'react-native';

export const DeliveryScreen = ({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'deliveryScreen'>) => {
  const [address, setAddress] = useState({} as Address);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    {} as DeliveryDateRange,
  );
  const [phoneNo, setPhoneNo] = useState('');
  const [additionalPhoneNo, setAdditionalPhoneNo] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const {msgs, theme} = useContext(UserContext);
  const dateFormat = 'ddd MM MMM YYYY';

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
        setExpectedDeliveryDate(inspectDeliveryDate());
      });
      return () => {
        setCardNumber('');
      };
    }, []),
  );

  return (
    <Grid>
      <Row>
        <Col>
          <Text
            style={inlineStyle.deliveryDate}
            text={`${msgs.expectedDeliveryDate} ${msgs.between} ${moment(
              expectedDeliveryDate.from,
            ).format(dateFormat)} ${msgs.and} ${moment(
              expectedDeliveryDate.to,
            ).format(dateFormat)}`}
          />
          <Card width="100%">
            <Text text={msgs.deliveryDetails} color={theme.secondary} bold />
            <Text text={msgs.address} color={theme.secondary} bold />
            <Text
              align={'left'}
              text={`${address.street}, ${address.building}, ${address.apartment}`}
            />
            <Text text={msgs.phoneNo} color={theme.secondary} bold />
            <Text text={phoneNo} />
            <Text text={msgs.additionalPhoneNo} color={theme.secondary} bold />
            <Text text={additionalPhoneNo} />
          </Card>
        </Col>
      </Row>
      <Row proportion={0} style={{backgroundColor: 'green'}}>
        <Col>
          <Card width="100%">
            <Text text={msgs.paymentMethod} />
            <Text text={msgs.credit} />
            <InputText
              value={cardNumber}
              placeholder={msgs.cardNumber}
              onChangeText={(val) => setCardNumber(val)}
            />
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

const inlineStyle = StyleSheet.create({
  deliveryDate: {
    padding: 10,
  },
});
