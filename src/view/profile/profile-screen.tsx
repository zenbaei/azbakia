import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/core';
import {Addresses} from 'component/address/address-component';
import {NavigationScreens} from 'constants/navigation-screens';
import {Address} from 'domain/address';
import {userService} from 'domain/user/user-service';
import React, {useCallback, useContext, useState} from 'react';
import {UserContext} from 'user-context';
import {updateDefaultAddress} from 'view/address/address-actions';
import {
  Grid,
  Row,
  Col,
  Text,
  Link,
  NavigationProps,
} from 'zenbaei-js-lib/react';

export const ProfileScreen = ({
  navigation,
}: NavigationProps<NavigationScreens, 'profileScreen'>) => {
  const {msgs} = useContext(UserContext);
  const [addresses, setAddresses] = useState({} as Address[]);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.profile);
    }, [msgs]),
  );

  useFocusEffect(
    useCallback(() => {
      userService.findOne('_id', global.user._id).then((usr) => {
        setAddresses(usr.address);
      });
    }, []),
  );

  return (
    <Grid>
      <Row>
        <Col>
          <Link
            label={msgs.changePassword}
            onPress={() => navigation.navigate('changePasswordScreen', {})}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text text={msgs.address} />
        </Col>
      </Row>
      <Row proportion={1}>
        <Col>
          <Addresses
            data={addresses}
            onPressCreateAddressScreen={() =>
              navigation.navigate('addressScreen', {
                addresses: addresses,
                index: undefined,
              })
            }
            onPressEdit={(idx) =>
              navigation.navigate('addressScreen', {
                addresses: addresses,
                index: idx,
              })
            }
            onSelectDefaultAddress={(ad) =>
              updateDefaultAddress(addresses, ad, (updatedAdds) =>
                setAddresses(updatedAdds),
              )
            }
          />
        </Col>
      </Row>
    </Grid>
  );
};
