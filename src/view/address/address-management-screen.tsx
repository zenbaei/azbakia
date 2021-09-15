import {useFocusEffect} from '@react-navigation/native';
import {NavigationScreens} from 'constants/navigation-screens';
import {City} from 'domain/city/city';
import React, {useCallback, useContext, useState} from 'react';
import {UserContext} from 'user-context';
import {
  Button,
  Col,
  Grid,
  InputText,
  NavigationProps,
  Picker,
  Row,
  Text,
} from 'zenbaei-js-lib/react';
import {loadCities} from './address-actions';
import {userService} from 'domain/user/user-service';
import {Address} from 'domain/address';
import {ScrollView} from 'react-native';
import {Snackbar} from 'react-native-paper';

export function AddressManagementScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'addressManagementScreen'>) {
  const addresses = route.params.addresses ? route.params.addresses : [];
  const editAddressAtIndex = route.params.index;
  const [selectedArea, setSelectedArea] = useState('');
  const [cities, setCities] = useState([] as City[]);
  const [selectedCity, setSelectedCity] = useState('');
  const [areas, setAreas] = useState([] as string[]);
  const [street, SetStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [building, setBuilding] = useState('');
  const [comment, setComment] = useState('');
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const {msgs, theme} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.createAddress);
      global.setDisplayCartBtn('none');
    }, [msgs]),
  );

  useFocusEffect(
    useCallback(() => {
      loadCities().then((cty) => {
        setCities(cty);
        if (editAddressAtIndex === undefined) {
          resetFieldsState(cty);
        } else {
          setFieldsState(cty);
        }
      });
    }, [editAddressAtIndex]),
  );

  const setFieldsState = (city: City[]) => {
    if (!addresses || editAddressAtIndex === undefined) {
      return;
    }
    const address: Address = addresses[editAddressAtIndex];
    SetStreet(address.street);
    setApartment(address.apartment);
    setBuilding(address.building);
    setComment(address.comment);
    setDefaultAddress(address.default);
    const c = city.find((ct) => ct.name === address.city);
    setAreas(c?.areas as string[]);
    setSelectedCity(address.city);
    setSelectedArea(address.area);
  };

  const resetFieldsState = (city: City[]) => {
    SetStreet('');
    setApartment('');
    setBuilding('');
    setComment('');
    setDefaultAddress(false);
    const c = city[0];
    setAreas(c.areas);
    setSelectedCity(c.name);
    setSelectedArea(c.areas[0]);
  };

  const onCityValueChange = (item: string) => {
    setSelectedCity(item);
    const cty = cities.find((ct) => ct.name === item);
    setAreas(cty?.areas as string[]);
  };

  const navigateAndUpdateParams = (
    adds: Address[],
    index: number,
    msg: string,
  ) => {
    navigation.navigate('addressManagementScreen', {
      addresses: adds,
      index: index,
    });
    setSnackBarMsg(msg);
    setSnackBarVisible(true);
  };

  const insertNewAddress = () => {
    const ad: Address = initAddress();
    const clonedAddresses = [...addresses];
    if (clonedAddresses && clonedAddresses.length === 0) {
      ad.default = true;
    }
    clonedAddresses.push(ad);

    userService
      .updateById(global.user._id, {
        $set: {address: clonedAddresses},
      })
      .then((mr) => {
        if (mr.modified === 1) {
          navigateAndUpdateParams(
            clonedAddresses,
            clonedAddresses.length - 1,
            msgs.addressCreated,
          );
        }
      });
  };

  const updateAddress = () => {
    const ad = initAddress();
    const clonedAddresses = [...addresses];
    clonedAddresses.splice(editAddressAtIndex as number, 1, ad);
    userService
      .updateById(global.user._id, {$set: {address: clonedAddresses}})
      .then((mr) => {
        if (mr.modified === 1) {
          navigateAndUpdateParams(
            clonedAddresses,
            editAddressAtIndex as number,
            msgs.addressUpdated,
          );
        }
      });
  };

  const initAddress = () => {
    return {
      street: street,
      city: selectedCity,
      area: selectedArea,
      building: building,
      apartment: apartment,
      comment: comment,
      default: defaultAddress,
    };
  };

  return (
    <Grid>
      <Row>
        <Col verticalAlign={'flex-start'}>
          <Picker
            selectedValue={selectedCity}
            onValueChange={onCityValueChange}
            data={cities.map((cty) => ({label: cty.name, value: cty.name}))}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Picker
            selectedValue={selectedArea}
            onValueChange={(item) => setSelectedArea(item)}
            data={areas.map((ar) => ({label: ar, value: ar}))}
          />
        </Col>
      </Row>
      <Row proportion={1}>
        <Col>
          <ScrollView>
            <Row>
              <Col>
                <Text align={'left'} text={msgs.street} />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputText
                  onChangeText={(tx) => SetStreet(tx)}
                  value={street}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Text align={'left'} text={msgs.building} />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputText
                  onChangeText={(tx) => setBuilding(tx)}
                  value={building}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Text align={'left'} text={msgs.apartment} />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputText
                  onChangeText={(tx) => setApartment(tx)}
                  value={apartment}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Text align="left" text={msgs.comment} />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputText
                  onChangeText={(tx) => setComment(tx)}
                  value={comment}
                />
              </Col>
            </Row>
          </ScrollView>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            label={msgs.save}
            onPress={() =>
              editAddressAtIndex === undefined
                ? insertNewAddress()
                : updateAddress()
            }
          />
          <Snackbar
            duration={2000}
            style={{
              backgroundColor: theme.secondary,
            }}
            visible={isSnackBarVisible}
            onDismiss={() => setSnackBarVisible(false)}>
            {snackBarMsg}
          </Snackbar>
        </Col>
      </Row>
    </Grid>
  );
}
