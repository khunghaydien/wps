import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';

import Chip from '../../atoms/Chip';

import './JorudanStatusChips.scss';

const ROOT = 'mobile-app-molecules-expense-jorudan-chips';

export type Props = Readonly<{
  className?: string;
  isEarliest: boolean;
  isCheapest: boolean;
  isMinTransfer: boolean;
  verticalRow?: boolean;
  isIncludeEx?: boolean;
  isRoundTrip?: boolean;
}>;

export default class JorudanStatusChips extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--vertical-row`]: this.props.verticalRow,
    });
    return (
      <div className={className}>
        {this.props.isCheapest && !this.props.isIncludeEx && (
          <Chip
            className={classNames(`${ROOT}__chip`, `${ROOT}__cheap`, {
              [`${ROOT}__chip--vertical-row`]: this.props.verticalRow,
            })}
            text={msg().Exp_Lbl_RouteIconCheap}
          />
        )}
        {this.props.isEarliest && !this.props.isIncludeEx && (
          <Chip
            className={classNames(`${ROOT}__chip`, `${ROOT}__fast`, {
              [`${ROOT}__chip--vertical-row`]: this.props.verticalRow,
            })}
            text={msg().Exp_Lbl_RouteIconFast}
          />
        )}
        {this.props.isMinTransfer && !this.props.isIncludeEx && (
          <Chip
            className={classNames(`${ROOT}__chip`, `${ROOT}__easy`, {
              [`${ROOT}__chip--vertical-row`]: this.props.verticalRow,
            })}
            text={msg().Exp_Lbl_RouteIconEasy}
          />
        )}
        {this.props.isIncludeEx && (
          <Chip
            className={classNames(`${ROOT}__chip`, `${ROOT}__ex`, {
              [`${ROOT}__chip--vertical-row`]: this.props.verticalRow,
            })}
            text={msg().Exp_Lbl_RouteIconEX}
          />
        )}
        {this.props.isRoundTrip && (
          <Chip
            className={classNames(`${ROOT}__chip`, `${ROOT}__round`, {
              [`${ROOT}__chip--vertical-row`]: this.props.verticalRow,
            })}
            text={msg().Exp_Lbl_RouteIconRoundTrip}
          />
        )}
      </div>
    );
  }
}
