import {Address} from 'domain/address';
import React, {useContext} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {UserContext} from 'user-context';
import {Button, Card, Col, Grid, Row} from 'zenbaei-js-lib/react';
import {AddressChild} from './address-child';

export const Addresses = ({
  data = [],
  onSelectDefaultAddress,
  onPressCreateAddressScreen,
  onPressEdit,
}: {
  data: Address[];
  onSelectDefaultAddress: onSetDefaultAddress;
  onPressCreateAddressScreen: () => void;
  onPressEdit: onEditAddress;
}): JSX.Element => {
  const {msgs, theme} = useContext(UserContext);

  return (
    <Grid>
      <Row>
        <Col>
          <Card width="100%" style={{height: '100%'}}>
            <Row>
              <Col>
                <Button
                  label={msgs.addAddress}
                  onPress={onPressCreateAddressScreen}
                />
              </Col>
            </Row>
            <Row proportion={1}>
              <Col>
                {data.length > 0 ? (
                  <ScrollView>
                    {data.map((ad, idx) => (
                      <AddressChild
                        key={idx}
                        address={ad}
                        index={idx}
                        onSelectDefaultAddress={onSelectDefaultAddress}
                        onPressEdit={onPressEdit}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <ActivityIndicator
                    animating={true}
                    color={theme.onBackground}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Grid>
  );
};

export type onSetDefaultAddress = (address: Address) => void;
export type onEditAddress = (index: number) => void;
