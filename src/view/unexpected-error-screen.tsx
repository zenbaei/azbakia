import {
  getMessages,
  MessagesInterface,
} from 'constants/in18/messages-interface';
import React, {useContext} from 'react';
import {Ctx, Grid, Row, Text} from 'zenbaei-js-lib/react';

export const UnexpectedErrorScreen = () => {
  const {language} = useContext(Ctx);
  const msgs: MessagesInterface = getMessages(language);
  return (
    <Grid>
      <Row>
        <Text text={msgs.unexpectedError} />
      </Row>
    </Grid>
  );
};
