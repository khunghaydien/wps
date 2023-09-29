import React from 'react';

import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';

import '../components/index.scss';

const ROOT = 'commons-dialog-frame';

type Props = {
  targetDate: string;
};

const Header = ({ ...props }: Props) => {
  const displayYMDd = [
    DateUtil.formatYMD(props.targetDate),
    `(${DateUtil.formatWeekday(props.targetDate)})`,
  ].join(' ');

  return (
    <div
      className={`slds-grid slds-grid--vertical-align-center ${ROOT}__header`}
    >
      <div className={`slds-grow ${ROOT}__header-title`}>
        {msg().Admin_Lbl_AttAllowance}
      </div>
      <time
        className={`${ROOT}__date`}
        dateTime={new Date(props.targetDate).toISOString()}
      >
        {displayYMDd}
      </time>
    </div>
  );
};

export default Header;
