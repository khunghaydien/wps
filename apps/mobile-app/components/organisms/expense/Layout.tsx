import React from 'react';

import LoadingPage from '../commons/LoadingPage';

type Props = Readonly<{
  isShowingBody: boolean;
  isShowing: boolean;
  children: React.ReactNode;
}>;

export default class Layout extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        <LoadingPage isShowing={this.props.isShowing} />
        {this.props.isShowingBody && this.props.children}
      </div>
    );
  }
}
