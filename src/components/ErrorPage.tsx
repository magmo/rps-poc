import _ from 'lodash';
import React from 'react';

interface Props {
  error: string;
}

const initialState = { error: "Application Error" };
type State = Readonly<typeof initialState>;

export default class ErrorPage extends React.PureComponent<Props, State> {
  readonly state: State = initialState;

  constructor(props) {
    super(props);
  }

  render() {
    return <div> Error: {this.state.error} </div>;
  }
}