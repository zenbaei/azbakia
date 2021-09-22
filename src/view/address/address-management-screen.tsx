import {useFocusEffect} from '@react-navigation/native';
import {NavigationScreens} from 'constants/navigation-screens';
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
import {Address, modificationResult} from 'zenbaei-js-lib/types';
import {isEmpty} from 'zenbaei-js-lib/utils';
import {
  findCountry,
  generateUUID,
  getAddress,
  getIndex,
} from './address-actions';
import {userService} from 'domain/user/user-service';
import {Alert, ScrollView} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {City, DistrictAndCharge} from 'domain/country/country';

export function AddressManagementScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'addressManagementScreen'>) {
  const [addresses, setAddresses] = useState([] as Address[]);
  const [cities, setCities] = useState([] as City[]);
  const [districts, setDistricts] = useState([] as DistrictAndCharge[]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [street, SetStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [building, setBuilding] = useState('');
  const [comment, setComment] = useState('');
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const {msgs, theme} = useContext(UserContext);
  const modifiedAddressId = route.params.id;

  const resetFieldsState = useCallback(() => {
    SetStreet('');
    setApartment('');
    setBuilding('');
    setComment('');
    setDefaultAddress(false);
    const c = cities[0];
    //setSelectedCity(c.city);
    //setDistricts(c.districtsAndCharges);
    // setSelectedDistrict(c.districtsAndCharges[0].district);
  }, []);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(
        modifiedAddressId === undefined
          ? msgs.createAddress
          : msgs.modifyAddress,
      );
      global.setDisplayCartBtn('none');

      userService.findOne('_id', global.user._id).then((usr) => {
        setAddresses(usr.addresses);
        findCountry(global.user.country).then((country) => {
          setCities(country.cities);
          if (modifiedAddressId !== undefined) {
            const address = getAddress(addresses, modifiedAddressId);
            SetStreet(address.street);
            setApartment(address.apartment);
            setBuilding(address.building);
            setComment(address.comment);
            setDefaultAddress(address.default);
            const c = country.cities.find((ct) => ct.city === address.city);
            setDistricts(c?.districtsAndCharges as DistrictAndCharge[]);
            setSelectedCity(address.city);
            setSelectedDistrict(address.district);
          }
        });
      });
      return resetFieldsState();
    }, [msgs, modifiedAddressId, resetFieldsState]),
  );

  const onCityValueChange = (item: string) => {
    setSelectedCity(item);
    const cty = cities.find((ct) => ct.city === item);
    setDistricts(cty?.districtsAndCharges as DistrictAndCharge[]);
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
        $set: {addresses: clonedAddresses},
      })
      .then((mr) => goBackOrShowError(mr));
  };

  const updateAddress = () => {
    const ad = initAddress();
    const clonedAddresses = [...addresses];
    clonedAddresses.splice(
      getIndex(addresses, modifiedAddressId as string),
      1,
      ad,
    );
    userService
      .updateById(global.user._id, {$set: {addresses: clonedAddresses}})
      .then((mr) => goBackOrShowError(mr));
  };

  const goBackOrShowError = (mr: modificationResult) => {
    if (mr.modified === 1) {
      navigation.goBack();
    } else {
      setSnackBarMsg(msgs.saveError);
      setSnackBarVisible(true);
    }
  };

  const save = () => {
    if (isEmpty(street) || isEmpty(apartment) || isEmpty(building)) {
      Alert.alert(msgs.addressMandatoryFields);
      return;
    }
    modifiedAddressId === undefined ? insertNewAddress() : updateAddress();
  };

  const initAddress = () => {
    return {
      id: generateUUID(),
      street: street,
      city: selectedCity,
      district: selectedDistrict,
      building: building,
      apartment: apartment,
      comment: comment,
      default: defaultAddress,
      country: global.user.country,
    };
  };

  return (
    <Grid>
      <Row>
        <Col verticalAlign={'flex-start'}>
          <Picker
            selectedValue={selectedCity}
            onValueChange={onCityValueChange}
            data={cities.map((cty) => ({
              label: cty.city,
              value: cty.city,
            }))}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={(item) => setSelectedDistrict(item)}
            data={districts.map((d) => ({
              label: d.district,
              value: d.district,
            }))}
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
          <Button label={msgs.save} onPress={save} />
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
