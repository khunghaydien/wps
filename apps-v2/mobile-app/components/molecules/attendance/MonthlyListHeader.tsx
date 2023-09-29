import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';

import ListHeader from '../../atoms/ListHeader';

import './MonthlyListHeader.scss';

const ROOT = 'mobile-app-molecules-attendance-monthly-list-header';

type Props = Readonly<{
  className?: string;
}>;

export default class MonthlyListHeader extends React.Component<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);

    return (
      <div className={className}>
        <div className={`${ROOT}__item`}>
          <ListHeader className={`${ROOT}__status`} />
          <ListHeader className={`${ROOT}__date`}>
            {msg().Att_Lbl_Date}
          </ListHeader>
          <ListHeader className={`${ROOT}__startTime`}>
            {msg().Att_Lbl_TimeIn}
          </ListHeader>
          <ListHeader className={`${ROOT}__endTime`}>
            {msg().Att_Lbl_TimeOut}
          </ListHeader>
        </div>
        <div className={`${ROOT}__icon-space`}>
          <ListHeader />
        </div>
      </div>
    );
  }
}
