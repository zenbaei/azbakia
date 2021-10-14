import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useContext, useState} from 'react';
import {Address} from 'zenbaei-js-lib/types';
import {
  Grid,
  Row,
  Col,
  Text,
  Card,
  InputText,
  Button,
} from 'zenbaei-js-lib/react';
import {NavigationProps} from 'zenbaei-js-lib/react/types/navigation-props';
import {NavigationScreens} from 'constants/navigation-screens';
import {userService} from 'domain/user/user-service';
import {UserContext} from 'user-context';
import {getDistrictCharge} from 'view/address/address-actions';
import {
  createOrder,
  DeliveryDateRange,
  formatDate,
  inspectDeliveryDate,
} from './delivery-actions';

import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {loadCartBooksVOs} from 'view/cart/cart-screen-actions';

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
  const [cvv, setCvv] = useState('');
  const {msgs, theme, cart, currency} = useContext(UserContext);

  const emptyString = '     ';
  const [showManageDeliveryDetailsBtn, setShowManageDeliveryDetailsBtn] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.delivery);
      userService.findOne('email', global.user.email).then((usr) => {
        if (
          !usr.addresses ||
          usr.addresses.length < 1 ||
          usr.phoneNo === undefined ||
          usr.phoneNo.length < 1
        ) {
          setShowManageDeliveryDetailsBtn(true);
          return;
        } else {
          setShowManageDeliveryDetailsBtn(false);
        }

        const ad = usr.addresses.find((a) => a.default);
        setAddress(ad as Address);
        setPhoneNo(usr.phoneNo);
        setAdditionalPhoneNo(usr.additionalPhoneNo);
        getDistrictCharge(ad as Address).then((charge) =>
          setDeliveryCharge(charge),
        );
        setExpectedDeliveryDate(inspectDeliveryDate());
      });
      return cleanup();
    }, [msgs]),
  );

  const cleanup = () => {
    setCardNumber('');
    setCvv('');
  };

  const checkout = async () => {
    await createOrder(loadCartBooksVOs(cart), expectedDeliveryDate);
    Alert.alert('Payment Gate');
  };

  return (
    <Grid>
      {showManageDeliveryDetailsBtn ? (
        <Row>
          <Col>
            <Text text={msgs.phoneAndAddressMandatory} />
            <Button
              label={msgs.modifyDeliveryInfo}
              onPress={() => navigation.navigate('profileScreen', {})}
            />
          </Col>
        </Row>
      ) : (
        <Row proportion={1}>
          <Col>
            <ScrollView>
              <Text
                style={inlineStyle.deliveryDate}
                text={`${msgs.expectedDeliveryDate} ${
                  msgs.between
                } ${formatDate(expectedDeliveryDate.from)} ${
                  msgs.and
                } ${formatDate(expectedDeliveryDate.to)}`}
              />
              <Card width="100%">
                <Text
                  text={msgs.deliveryDetails}
                  color={theme.secondary}
                  bold
                  style={inlineStyle.deliveryDetails}
                />
                <View style={inlineStyle.viewRow}>
                  <Text
                    text={`${msgs.address}: `}
                    color={theme.secondary}
                    bold
                  />
                  <Text text={formatAddress(address)} />
                </View>
                <View style={inlineStyle.viewRow}>
                  <Text
                    text={`${msgs.phoneNo}: `}
                    color={theme.secondary}
                    bold
                  />
                  <Text text={phoneNo} />
                </View>

                <View style={inlineStyle.viewRow}>
                  <Text
                    text={`${msgs.additionalPhoneNo}: `}
                    color={theme.secondary}
                    bold
                  />
                  <Text text={additionalPhoneNo} />
                </View>
                <Button
                  align="flex-end"
                  label={'Change'}
                  style={inlineStyle.buttonChange}
                  onPress={() => navigation.navigate('profileScreen', {})}
                />
              </Card>
              <Card width="100%">
                <Text text={msgs.paymentMethod} color={theme.secondary} bold />
                <Text text={msgs.credit} align="left" color={theme.secondary} />
                <InputText
                  value={cardNumber}
                  placeholder={msgs.cardNumber}
                  onChangeText={(val) => setCardNumber(val)}
                />
                <InputText
                  value={cvv}
                  placeholder={msgs.cvv}
                  onChangeText={(val) => setCvv(val)}
                />
              </Card>
            </ScrollView>

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
              text={emptyString}
              line="underline"
              color={theme.secondary}
            />
            <Text
              color={theme.secondary}
              align="right"
              text={`${msgs.total}: ${
                route.params.cartTotalPrice + deliveryCharge
              } ${currency}`}
            />
            <Button width="100%" label={msgs.checkout} onPress={checkout} />
          </Col>
        </Row>
      )}
    </Grid>
  );
};

const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.building}, ${address.apartment}, ${address.district}, ${address.city}`;
};

const inlineStyle = StyleSheet.create({
  deliveryDate: {
    padding: 10,
  },
  deliveryDetails: {paddingBottom: 10},
  viewRow: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonChange: {alignSelf: 'flex-end'},
});
