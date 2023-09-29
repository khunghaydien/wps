import * as React from 'react';

import classNames from 'classnames';

import msg from '@apps/commons/languages';

import ListHeader from '../../../atoms/ListHeader';

import './MonthlyListHeader.scss';

const ROOT = 'mobile-app-organisms-attendance-monthly-list-header';

type Props = Readonly<{
  className?: string;
}>;

const MonthlyListHeader: React.FC<Props> = (props) => {
  const className = classNames(ROOT, props.className);

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
};

export default MonthlyListHeader;
