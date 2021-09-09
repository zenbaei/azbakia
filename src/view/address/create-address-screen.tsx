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
import {currency} from '../../../app.config';
import {loadCities} from '../delivery/delivery-screen-actions';
import {userService} from 'domain/user/user-service';
import {Address} from 'domain/address';

export function CreateAddressScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'deliveryScreen'>) {
  const [selectedArea, setSelectedArea] = useState('');
  const [cities, setCities] = useState([] as City[]);
  const [selectedCity, setSelectedCity] = useState('');
  const [areas, setAreas] = useState([] as string[]);
  const [street, SetStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [apartment, setApartment] = useState('');
  const [building, setBuilding] = useState('');
  const {msgs} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.createAddress);
      global.setDisplayCartBtn('none');
      loadCities().then((cty) => setCities(cty));
    }, [msgs]),
  );

  const onCityValueChange = (item: string) => {
    setSelectedCity(item);
    const cty = cities.find((ct) => ct.name === item);
    setAreas(cty?.areas as string[]);
    setCity(item);
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
            onValueChange={(item) => {
              setSelectedArea(item);
              setArea(item);
            }}
            data={areas.map((ar) => ({label: ar, value: ar}))}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text text={msgs.street} />
        </Col>
        <Col>
          <InputText onChangeText={(tx) => SetStreet(tx)} value={street} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text text={msgs.building} />
        </Col>
        <Col>
          <InputText onChangeText={(tx) => setBuilding(tx)} value={building} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text text={msgs.apartment} />
        </Col>
        <Col>
          <InputText
            onChangeText={(tx) => setApartment(tx)}
            value={apartment}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text text={msgs.phoneNo} />
        </Col>
        <Col>
          <InputText onChangeText={(tx) => setPhoneNo(tx)} value={phoneNo} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text text={msgs.street} />
        </Col>
        <Col>
          <InputText onChangeText={(tx) => SetStreet(tx)} value={street} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            label={msgs.checkout}
            onPress={() => navigation.navigate('paymentScreen', {})}
          />
        </Col>
      </Row>
    </Grid>
  );
}
