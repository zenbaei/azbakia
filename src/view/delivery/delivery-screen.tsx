import {useFocusEffect} from '@react-navigation/native';
import {getMessages} from 'constants/in18/messages-interface';
import {NavigationScreens} from 'constants/navigation-screens';
import {City} from 'domain/city/city';
import React, {useCallback, useContext, useState} from 'react';
import {ScrollView} from 'react-native';
import {UserContext} from 'user-context';
import {
  Button,
  Card,
  Col,
  Ctx,
  Grid,
  NavigationProps,
  Picker,
  Text,
} from 'zenbaei-js-lib/react';
import {loadCities} from './delivery-screen-actions';

export function DeliveryScreen({
  navigation,
}: NavigationProps<NavigationScreens, 'deliveryScreen'>) {
  const [selectedArea, setSelectedArea] = useState('');
  const [cities, setCities] = useState([] as City[]);
  const [selectedCity, setSelectedCity] = useState('');
  const [areas, setAreas] = useState([] as string[]);
  const {msgs} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.delivery);
      global.setDisplayCartBtn('none');
      loadCities().then((cty) => setCities(cty));
    }, [msgs.delivery]),
  );

  const onCityValueChange = (item: string) => {
    setSelectedCity(item);
    const city = cities.find((ct) => ct.name === item);
    setAreas(city?.areas as string[]);
  };

  return (
    <Grid>
      <Col>
        <ScrollView>
          <Card>
            <Picker
              selectedValue={selectedCity}
              onValueChange={onCityValueChange}
              data={cities.map((cty) => ({label: cty.name, value: cty.name}))}
            />
          </Card>
          <Card>
            <Picker
              selectedValue={selectedArea}
              onValueChange={(item) => setSelectedArea(item)}
              data={areas.map((ar) => ({label: ar, value: ar}))}
            />
          </Card>
        </ScrollView>
        <Text text={`${msgs.deliveryCharge}: ${0}`} />
        <Button
          label={msgs.checkout}
          onPress={() => navigation.navigate('paymentScreen', {})}
        />
      </Col>
    </Grid>
  );
}
