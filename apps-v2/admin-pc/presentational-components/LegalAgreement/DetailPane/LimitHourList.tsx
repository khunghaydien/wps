import React from 'react';

import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import { LimitEvent } from '../../../models/legal-agreement/LegalAgreementEvent';

import { EditButton, Grid } from './CustomComponents';

type Props = {
  disabled: boolean;
  event: LimitEvent;
  onClickEditButton: (flag: boolean) => void;
};

const format = (time1, time2, time3, event) => {
  let isHave = false;
  if (Object.keys(event).length === 0) {
    if (time1 === undefined && time2 === undefined && time3 === undefined) {
      return null;
    } else if (time1 === null && time2 === null && time3 === null) {
      return null;
    }
  } else if (Object.keys(event).length > 0) {
    isHave = Object.keys(event).some((item) => event[item] !== null);
  }
  if (isHave) {
    if (!time1) {
      time1 = '--';
    }
    if (!time2) {
      time2 = '--';
    }
    if (!time3) {
      time3 = '--';
    }
    return (
      time1 +
      TextUtil.template(msg().Com_Str_Parenthesis, time2 + '・' + time3) +
      msg().Com_Lbl_Hours
    );
  } else {
    return null;
  }
};

const LimitHourList: React.FC<Props> = ({
  disabled,
  event,
  onClickEditButton,
}) => {
  const list = [
    {
      monthlyOvertime: format(
        event.monthlyOvertimeLimit,
        event.monthlyOvertimeWarning1,
        event.monthlyOvertimeWarning2,
        event
      ),
      yearlyOvertime: format(
        event.yearlyOvertimeLimit,
        event.yearlyOvertimeWarning1,
        event.yearlyOvertimeWarning2,
        event
      ),
      multiMonthOvertime: format(
        event.multiMonthOvertimeLimit,
        event.multiMonthOvertimeWarning1,
        event.multiMonthOvertimeWarning2,
        event
      ),
      disabled,
    },
  ];
  const formatEditButton = ({ row: { disabled } }) => {
    return (
      <EditButton
        type="default"
        disabled={disabled}
        onClick={() => onClickEditButton(true)}
      >
        {msg().Com_Btn_Edit}
      </EditButton>
    );
  };

  return (
    <div>
      <div
        style={{
          paddingRight: '14px',
          paddingLeft: '10px',
          color: '#53688c',
          position: 'relative',
        }}
      >
        {msg().Admin_Lbl_OvertimeWorkWithinTheLimit}
      </div>
      <Grid
        columns={[
          {
            key: '',
            name: '',
            formatter: formatEditButton,
            resizable: true,
          },
          {
            key: 'monthlyOvertime',
            name: msg().Admin_Lbl_MonthlyOvertimeLimitWarn,
            width: 220,
            resizable: true,
          },
          {
            key: 'yearlyOvertime',
            name: msg().Admin_Lbl_YearlyOvertimeLimitWarn,
            width: 220,
            resizable: true,
          },
          {
            key: 'multiMonthOvertime',
            name: msg().Admin_Lbl_MultiMonthAverageLimitWarn,
            width: 220,
            resizable: true,
          },
        ]}
        rows={list}
      />
    </div>
  );
};

export default LimitHourList;
