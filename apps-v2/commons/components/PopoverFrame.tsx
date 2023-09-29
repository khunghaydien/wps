import React from 'react';

import './PopoverFrame.scss';

const ROOT = 'commons-popover-frame';

export type Props = {
  onClickOverlay: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

export default class PopoverFrame extends React.Component<Props> {
  render() {
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div className={ROOT}>
        {/* TODO Use react-click-outside */}
        {/* cf https://github.com/tj/react-click-outside */}
        <div
          className={`${ROOT}__backdrop`}
          onClick={this.props.onClickOverlay}
        />
        {this.props.children}
      </div>
    );
  }
  /* eslint-enable jsx-a11y/no-static-element-interactions */
}
