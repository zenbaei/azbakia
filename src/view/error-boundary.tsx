import React from 'react';
import {Col, Grid, Row, Text} from 'zenbaei-js-lib/react';

type ErrorState = {hasError: boolean};

export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(_error: any, _errorInfo: any) {
    // You can also log the error to an error reporting service
  }

  render() {
    if ((this.state as ErrorState).hasError) {
      // You can render any custom fallback UI
      return (
        <Grid>
          <Row>
            <Col>
              <Text text="Something went wrong.." />
            </Col>
          </Row>
        </Grid>
      );
    }

    return this.props.children;
  }
}
