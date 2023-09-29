import React from 'react';

import './PopupWindowNavbar.scss';

const ROOT = 'commons-popup-window-navbar';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default class PopupWindowNavbar extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__left`} />
        <div className={`${ROOT}__title`}>{this.props.title}</div>
        <div className={`${ROOT}__right`}>{this.props.children}</div>
      </div>
    );
  }
}
