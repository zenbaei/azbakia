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
import {loadCities} from '../delivery/delivery-screen-actions';
import {userService} from 'domain/user/user-service';
import {Address} from 'domain/address';
import {ScrollView} from 'react-native';

export function AddressScreen({
  route,
}: NavigationProps<NavigationScreens, 'addressScreen'>) {
  const addresses = route.params.addresses;
  const editAddressAtIndex = route.params.index;
  const [selectedArea, setSelectedArea] = useState('');
  const [cities, setCities] = useState([] as City[]);
  const [selectedCity, setSelectedCity] = useState('');
  const [areas, setAreas] = useState([] as string[]);
  const [street, SetStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [building, setBuilding] = useState('');
  const [comment, setComment] = useState('');
  const {msgs} = useContext(UserContext);

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
        if (addresses && editAddressAtIndex) {
          const address = addresses[editAddressAtIndex];
          SetStreet(address.street);
          setApartment(address.apartment);
          setBuilding(address.building);
          setComment(address.comment);
          const c = cty.find((ct) => ct.name === address.city);
          setAreas(c?.areas as string[]);
          setSelectedCity(address.city);
          setSelectedArea(address.area);
        } else {
          SetStreet('');
          setApartment('');
          setBuilding('');
          setComment('');
          const c = cty[0];
          setAreas(c?.areas as string[]);
          setSelectedCity(c.name);
        }
      });
    }, [addresses, editAddressAtIndex]),
  );

  const onCityValueChange = (item: string) => {
    setSelectedCity(item);
    const cty = cities.find((ct) => ct.name === item);
    setAreas(cty?.areas as string[]);
  };

  const insertNewAddress = () => {
    const ad: Address = {
      street: street,
      city: selectedCity,
      area: selectedArea,
      building: building,
      apartment: apartment,
      comment: comment,
      default: false,
    };
    if (editAddressAtIndex) {
      addresses?.splice(editAddressAtIndex, 1, ad);
      userService.updateById(global.user._id, {$set: {address: addresses}});
    } else {
      userService.updateById(global.user._id, {$push: {address: ad}});
    }
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
            <Row>
              <Col>
                <Text align="left" text={msgs.defaultAddress} />
              </Col>
            </Row>
          </ScrollView>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button label={msgs.save} onPress={() => insertNewAddress} />
        </Col>
      </Row>
    </Grid>
  );
}
