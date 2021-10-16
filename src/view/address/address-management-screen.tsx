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
  SnackBar,
  Text,
} from 'zenbaei-js-lib/react';
import {Address} from 'zenbaei-js-lib/types';
import {isEmpty} from 'zenbaei-js-lib/utils';
import {
  findCountry,
  generateUUID,
  insertAddress,
  updateAddress,
} from './address-actions';
import {userService} from 'domain/user/user-service';
import {Alert, ScrollView} from 'react-native';
import {City, DistrictAndCharge} from 'domain/country/country';

export function AddressManagementScreen({
  navigation,
  route,
}: NavigationProps<NavigationScreens, 'addressManagementScreen'>) {
  const [cities, setCities] = useState([] as City[]);
  const [districts, setDistricts] = useState([] as DistrictAndCharge[]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [building, setBuilding] = useState('');
  const [comment, setComment] = useState('');
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [isSnackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const {msgs, cart} = useContext(UserContext);
  const modifiedAddressId = route.params.id;

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(
        modifiedAddressId === undefined
          ? msgs.createAddress
          : msgs.modifyAddress,
      );
      global.setDisplayCartBtn(cart);
    }, [msgs, modifiedAddressId, cart]),
  );

  const cleanUp = useCallback(() => {
    setStreet('');
    setApartment('');
    setBuilding('');
    setComment('');
    setDefaultAddress(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      findCountry(global.user.country).then((country) => {
        const cty = country.cities[0];
        setCities(country.cities);
        setDistricts(cty.districtsAndCharges);
        setSelectedCity(cty.city);
      });
      return cleanUp();
    }, [cleanUp]),
  );

  useFocusEffect(
    useCallback(() => {
      if (modifiedAddressId === undefined || cities.length === 0) {
        return;
      }
      userService.findOne('_id', global.user._id).then((usr) => {
        const ad = usr.addresses.find(
          (d) => d.id === modifiedAddressId,
        ) as Address;
        setStreet(ad.street);
        setBuilding(ad.building);
        setApartment(ad.apartment);
        setComment(ad.comment);
        setDefaultAddress(ad.default);
        const cty = cities.find((c) => c.city === ad.city) as City;
        setDistricts(cty.districtsAndCharges);
        setSelectedCity(ad.city);
        setSelectedDistrict(ad.district);
      });
    }, [cities, modifiedAddressId]),
  );

  const onCityValueChange = (item: string) => {
    setSelectedCity(item);
    const cty = cities.find((ct) => ct.city === item) as City;
    setDistricts(cty.districtsAndCharges);
    setSelectedDistrict(cty.districtsAndCharges[0].district);
  };

  const insertNewAddress = () => {
    const ad: Address = initAddress();
    insertAddress(ad, (inserted) => goBackOrShowSnackbar(inserted));
  };

  const _updateAddress = () => {
    updateAddress(modifiedAddressId as string, initAddress(), (updated) =>
      goBackOrShowSnackbar(updated),
    );
  };

  const goBackOrShowSnackbar = (updated: boolean) => {
    if (updated) {
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
    modifiedAddressId === undefined ? insertNewAddress() : _updateAddress();
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
    <>
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
                    onChangeText={(tx) => setStreet(tx)}
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
            <Button label={msgs.save} onPress={save} width="100%" />
          </Col>
        </Row>
      </Grid>
      <SnackBar
        visible={isSnackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        msg={snackBarMsg}
      />
    </>
  );
}
