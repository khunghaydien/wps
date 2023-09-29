import * as React from 'react';

import Loading from '../../molecules/commons/Loading';

export type Props = Readonly<{
  isShowing: boolean;
}>;

export default class LoadingPage extends React.PureComponent<Props> {
  render() {
    return this.props.isShowing ? (
      <Loading
        theme="light" // NOTE
        // We could not make sure that loading message is helpful to user at winter'19
        // text={msg().Com_Msg_LoadingPage}
      />
    ) : null;
  }
}
