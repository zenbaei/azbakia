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
} from 'zenbaei-js-lib/react';
import {currency} from '../../../app.config';
import {Addresses} from '../../component/address/address-component';
import {userService} from 'domain/user/user-service';
import {Address} from 'domain/address';
import {updateDefaultAddress} from 'view/address/address-actions';

import {NavigationScreens} from 'constants/navigation-screens';
import {SnackBar} from 'component/snack-bar-component';
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
  const {msgs} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      setShowLoadingIndicator(true);
      setShowNoAddress(false);
      userService.findOne('_id', global.user._id).then((user) => {
        setAddresses(user.address);
        setShowLoadingIndicator(false);
        setShowNoAddress(true);
      });
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(route.params.title);
      global.setDisplayCartBtn('none');
    }, [route.params.title]),
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
      show={isSnackBarVisible}
      msg={snackBarMsg}
      onDismiss={() => setSnackBarVisible(false)}
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
                addresses: addresses,
                index: undefined,
              })
            }
            onSelectDefaultAddress={_updateDefaultAddress}
            onPressEdit={(idx) =>
              navigation.navigate('addressManagementScreen', {
                addresses: addresses,
                index: idx,
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
              text={`${msgs.deliveryCharge}: ${0} ${currency}`}
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
