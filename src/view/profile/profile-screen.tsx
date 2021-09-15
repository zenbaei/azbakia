import {useFocusEffect} from '@react-navigation/core';
import {NavigationScreens} from 'constants/navigation-screens';
import React, {useCallback, useContext} from 'react';
import {UserContext} from 'user-context';
import {Grid, Row, Col, Link, NavigationProps} from 'zenbaei-js-lib/react';

export const ProfileScreen = ({
  navigation,
}: NavigationProps<NavigationScreens, 'profileScreen'>) => {
  const {msgs} = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      global.setAppBarTitle(msgs.profile);
    }, [msgs]),
  );
  /*
  useFocusEffect(
    useCallback(() => {});
    }, []),
  );
*/

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
          <Link
            label={msgs.manageAddress}
            onPress={() =>
              navigation.navigate('addressListScreen', {
                isDeliveryScreen: false,
                title: msgs.address,
              })
            }
          />
        </Col>
      </Row>
    </Grid>
  );
};
