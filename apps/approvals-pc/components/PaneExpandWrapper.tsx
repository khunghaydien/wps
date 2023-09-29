import React from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import './PaneExpandWrapper.scss';

const ROOT = 'approvals-pc-pane-expand-wrapper';

type Props = {
  list: any;
  detail: any;
  detailExpanded?: boolean;
};

export default class PaneExpandWrapper extends React.Component<Props> {
  static propTypes = {
    list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    detail: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    detailExpanded: PropTypes.bool,
  };

  static defaultProps = {
    detailExpanded: false,
  };

  render() {
    const detailCssClass = classNames(`${ROOT}__detail`, {
      [`${ROOT}__detail--is-expand`]: this.props.detailExpanded,
    });

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__list`}>{this.props.list}</div>
        <div className={detailCssClass}>{this.props.detail}</div>
      </div>
    );
  }
}
