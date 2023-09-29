import React from 'react';

import './PopupWindowPage.scss';

const ROOT = 'commons-popup-window-page';

type Props = {
  children: React.ReactNode;
};
export default class PopupWindowPage extends React.Component<Props> {
  render() {
    return <div className={ROOT}>{this.props.children}</div>;
  }
}
