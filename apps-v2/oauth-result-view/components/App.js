/* @flow */
import React from 'react';

import ErrorPage from '../../commons/components/ErrorPage';
import MessageBoard from '../../commons/components/MessageBoard';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import BaseWSPError from '../../commons/errors/BaseWSPError';
import imgIconDoneCircle from '../../commons/images/iconDoneCircle.png';
import msg from '../../commons/languages';

// Use union type
export type Props = {
  done: boolean,
  isSucceeded: boolean,
  error: BaseWSPError,
};

export default class App extends React.Component<Props> {
  renderResult() {
    if (this.props.isSucceeded) {
      const message = msg().Oauth_Msg_CalendarAccessAuthSuccess;
      const description = msg().Oauth_Msg_CalendarAccessAuthSuccessRemarks;

      return (
        <MessageBoard
          message={message}
          iconSrc={imgIconDoneCircle}
          description={description}
        />
      );
    } else if (this.props.error) {
      return <ErrorPage error={this.props.error} />;
    }
    return <div />;
  }

  render() {
    return (
      <GlobalContainer>
        {this.props.done ? this.renderResult() : <div />}
      </GlobalContainer>
    );
  }
}
