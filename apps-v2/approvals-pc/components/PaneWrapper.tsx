import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import './PaneWrapper.scss';

const ROOT = 'approvals-pc-pane-wrapper';

type Props = {
  list: any;
  detail: any;
  isShowSidePanel?: boolean;
};

export default class PaneWrapper extends React.Component<Props> {
  static propTypes = {
    list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    detail: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  };

  render() {
    const cssClass = classNames(ROOT, {
      'with-side-panel': this.props.isShowSidePanel,
    });
    return (
      <div className={`${cssClass}`}>
        <div className={`${ROOT}__list`}>{this.props.list}</div>
        <div className={`${ROOT}__detail`}>{this.props.detail}</div>
      </div>
    );
  }
}
