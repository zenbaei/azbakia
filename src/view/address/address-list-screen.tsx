import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {UserContext} from 'user-context';
import {
  Col,
  Grid,
  Row,
  NavigationProps,
  SnackBar,
  Addresses,
} from 'zenbaei-js-lib/react';
import {userService} from 'domain/user/user-service';
import {Address} from 'zenbaei-js-lib/types/address';
import {getIndex, updateDefaultAddress} from 'view/address/address-actions';
import {NavigationScreens} from 'constants/navigation-screens';

export function AddressListScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'addressListScreen'>) {
  const [addresses, setAddresses] = useState([] as Address[]);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [isShowLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [isShowNoAddress, setShowNoAddress] = useState(false);
  const {msgs, cart} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      setShowLoadingIndicator(true);
      setShowNoAddress(false);
      userService.findOne('_id', global.user._id).then((user) => {
        setAddresses(user.addresses);
        setShowLoadingIndicator(false);
        setShowNoAddress(true);
      });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.address);
      global.setDisplayCartBtn(cart.products);
    }, [msgs, cart]),
  );

  const _updateDefaultAddress = (id: string) => {
    updateDefaultAddress(addresses, id, (updatedAdds) => {
      setAddresses(updatedAdds);
      setSnackBarMsg(msgs.defaultAddressUpdated);
      setSnackBarVisible(true);
    });
  };

  const deleteAddress = (id: string) => {
    const clonedAddresses = [...addresses];
    const idx = getIndex(clonedAddresses, id);
    const deletedAd = clonedAddresses.splice(idx, 1);
    if (deletedAd[0].default === true && clonedAddresses.length > 0) {
      clonedAddresses[0].default = true;
    }
    userService
      .updateById(global.user._id, {$set: {addresses: clonedAddresses}})
      .then((mr) => {
        if (mr.modified === 1) {
          setAddresses(clonedAddresses);
          setSnackBarMsg(msgs.addressDeleted);
          setSnackBarVisible(true);
        }
      });
  };

  const MySnack = () => (
    <SnackBar
      visible={isSnackBarVisible}
      msg={snackBarMsg}
      onDismiss={setSnackBarVisible}
    />
  );

  return (
    <>
      <Grid>
        <Row proportion={1}>
          <Col>
            <Addresses
              showLoadingIndicator={isShowLoadingIndicator}
              showNoAddress={isShowNoAddress}
              data={addresses}
              onPressCreate={() =>
                navigation.navigate('addressManagementScreen', {id: undefined})
              }
              onSelectDefaultAddress={_updateDefaultAddress}
              onPressEdit={(id) =>
                navigation.navigate('addressManagementScreen', {
                  id: id,
                })
              }
              onPressDelete={deleteAddress}
            />
          </Col>
        </Row>
      </Grid>
      <MySnack />
    </>
  );
}
