import {useFocusEffect} from '@react-navigation/native';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext, useState} from 'react';
import {UserContext} from 'user-context';
import {
  Button,
  Col,
  Grid,
  NavigationProps,
  Row,
  Text,
} from 'zenbaei-js-lib/react';
import {currency} from '../../../app.config';
import {Addresses} from '../../component/address/address-component';
import {userService} from 'domain/user/user-service';
import {Address} from 'domain/address';

export function DeliveryScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'deliveryScreen'>) {
  const [addresses, setAddresses] = useState([] as Address[]);
  const {msgs} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.chooseDeliveryAddress);
      global.setDisplayCartBtn('none');
      userService.findOne('_id', global.user._id).then((user) => {
        setAddresses(user.address);
      });
    }, [msgs.chooseDeliveryAddress]),
  );

  return (
    <Grid>
      <Row proportion={1}>
        <Col>
          <Addresses
            data={addresses}
            onSelectDefaultAddress={(adr) => {
              const updatedAdds = addresses.map((ad) => {
                ad.phoneNo === adr.phoneNo
                  ? (ad.default = true)
                  : (ad.default = false);
                return ad;
              });
              userService.updateById(global.user._id, {
                $set: {address: updatedAdds},
              });
              setAddresses(updatedAdds);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text
            align="right"
            text={`${msgs.deliveryCharge}: ${0} ${currency}`}
          />
          <Button
            label={msgs.checkout}
            onPress={() => navigation.navigate('paymentScreen', {})}
          />
        </Col>
      </Row>
    </Grid>
  );
}
