import React, {useContext} from 'react';
import {Address} from 'domain/address';
import {Card, Col, Grid, Row, Text} from 'zenbaei-js-lib/react';
import {IconButton, RadioButton} from 'react-native-paper';
import {UserContext} from 'user-context';
import {onSetDefaultAddress, onEditAddress} from './address-component';

export const AddressChild = ({
  address,
  index,
  onSelectDefaultAddress,
  onPressEdit,
}: {
  address: Address;
  index: number;
  onSelectDefaultAddress: onSetDefaultAddress;
  onPressEdit: onEditAddress;
}): JSX.Element => {
  const {msgs, theme} = useContext(UserContext);
  return (
    <Grid style={{backgroundColor: 'transparent'}}>
      <Row>
        <Col proportion={9}>
          <Card width={'95%'}>
            <Grid>
              <Row style={{backgroundColor: theme.primary}}>
                <Col>
                  <Text text={msgs.street} />
                </Col>
                <Col>
                  <Text text={address.street} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text text={msgs.apartment} />
                </Col>
                <Col>
                  <Text text={address.apartment} />
                </Col>
              </Row>
              <Row style={{backgroundColor: theme.primary}}>
                <Col>
                  <Text text={msgs.city} />
                </Col>
                <Col>
                  <Text text={address.city} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text text={msgs.area} />
                </Col>
                <Col>
                  <Text text={address.area} />
                </Col>
              </Row>
            </Grid>
            <IconButton
              style={{alignSelf: 'flex-end'}}
              color={theme.secondary}
              icon={'pen'}
              onPress={() => onPressEdit(index)}
            />
          </Card>
        </Col>
        <Col height={'100%'} verticalAlign={'center'}>
          <RadioButton
            value={index.toString()}
            status={address.default ? 'checked' : 'unchecked'}
            color={theme.secondary}
            uncheckedColor={theme.primary}
            onPress={() => onSelectDefaultAddress(address)}
          />
        </Col>
      </Row>
    </Grid>
  );
};
