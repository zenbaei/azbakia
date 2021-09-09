import {Address} from 'domain/address';
import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import {UserContext} from 'user-context';
import {Button, Card, Col, Grid, Row} from 'zenbaei-js-lib/react';
import {AddressChild} from './address-child';

export const Addresses = ({
  data,
  onSelectDefaultAddress,
}: {
  data: Address[];
  onSelectDefaultAddress: onSelectAddress;
}): JSX.Element => {
  const {msgs} = useContext(UserContext);

  return (
    <Grid>
      <Row>
        <Col>
          <Card width="100%" style={{height: '100%'}}>
            <Row>
              <Col>
                <Button label={msgs.addAddress} onPress={() => {}} />
              </Col>
            </Row>
            <Row proportion={1}>
              <Col>
                <ScrollView>
                  {data.map((ad) => (
                    <AddressChild
                      key={ad.phoneNo}
                      address={ad}
                      onSelectDefaultAddress={onSelectDefaultAddress}
                    />
                  ))}
                </ScrollView>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Grid>
  );
};

export type onSelectAddress = (selecetdAddress: Address) => void;
