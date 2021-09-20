import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {UserContext} from 'user-context';
import {
  Button,
  Col,
  Grid,
  Row,
  Text,
  NavigationProps,
  SnackBar,
  Addresses,
} from 'zenbaei-js-lib/react';
import {currency} from '../../../app.config';

import {userService} from 'domain/user/user-service';
import {Address} from 'zenbaei-js-lib/types/address';
import {
  getDefaultAddressCharge,
  updateDefaultAddress,
} from 'view/address/address-actions';

import {NavigationScreens} from 'constants/navigation-screens';
import {Alert} from 'react-native';

export function AddressListScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'addressListScreen'>) {
  const [addresses, setAddresses] = useState([] as Address[]);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [isShowLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [isShowNoAddress, setShowNoAddress] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const {msgs} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      setShowLoadingIndicator(true);
      setShowNoAddress(false);
      userService.findOne('_id', global.user._id).then((user) => {
        setAddresses(user.addresses);
        setShowLoadingIndicator(false);
        setShowNoAddress(true);
        getDefaultAddressCharge(addresses).then((charge) =>
          setDeliveryCharge(charge),
        );
      });
    }, [addresses]),
  );
  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.address);
      global.setDisplayCartBtn('none');
    }, [msgs]),
  );

  const _updateDefaultAddress = (address: Address) => {
    updateDefaultAddress(addresses, address, (updatedAdds) => {
      setAddresses(updatedAdds);
      setSnackBarMsg(msgs.defaultAddressUpdated);
      setSnackBarVisible(true);
    });
  };

  const deleteAddress = (index: number) => {
    const clonedAddresses = [...addresses];
    const deletedAd = clonedAddresses.splice(index, 1);
    if (deletedAd[0].default === true && clonedAddresses.length > 0) {
      clonedAddresses[0].default = true;
    }
    userService
      .updateById(global.user._id, {$set: {address: clonedAddresses}})
      .then((mr) => {
        if (mr.modified === 1) {
          setAddresses(clonedAddresses);
          setSnackBarMsg(msgs.addressDeleted);
          setSnackBarVisible(true);
        }
      });
  };

  const checkout = () => {
    if (!addresses || addresses.length === 0) {
      Alert.alert(msgs.pleaseAddAddress);
    } else {
      navigation.navigate('paymentScreen', {});
    }
  };

  const MySnack = () => (
    <SnackBar
      visible={isSnackBarVisible}
      msg={snackBarMsg}
      onDismiss={setSnackBarVisible}
    />
  );

  return (
    <Grid>
      <Row proportion={1}>
        <Col>
          <Addresses
            showLoadingIndicator={isShowLoadingIndicator}
            showNoAddress={isShowNoAddress}
            data={addresses}
            onPressCreateAddressScreen={() =>
              navigation.navigate('addressManagementScreen', {
                status: 'Create',
              })
            }
            onSelectDefaultAddress={_updateDefaultAddress}
            onPressEdit={(idx) =>
              navigation.navigate('addressManagementScreen', {
                index: idx,
                status: 'Modify',
              })
            }
            onPressDelete={deleteAddress}
          />
        </Col>
      </Row>
      {route.params.isDeliveryScreen ? (
        <Row>
          <Col>
            <Text
              align="right"
              text={`${msgs.cart}: ${route.params.total} ${currency}`}
            />
            <Text
              align="right"
              text={`${msgs.deliveryCharge}: ${deliveryCharge} ${currency}`}
            />
            <Text align="right" text="---------" />
            <Text
              align="right"
              text={`${msgs.total}: ${
                (route.params.total as number) + deliveryCharge
              } ${currency}`}
            />
            <Button label={msgs.checkout} onPress={checkout} />
            <MySnack />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <MySnack />
          </Col>
        </Row>
      )}
    </Grid>
  );
}
