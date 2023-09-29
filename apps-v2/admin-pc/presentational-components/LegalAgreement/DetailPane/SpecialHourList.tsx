import React from 'react';

import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import { SpecialEvent } from '../../../models/legal-agreement/LegalAgreementEvent';

import { EditButton, Grid } from './CustomComponents';

type Props = {
  disabled: boolean;
  event: SpecialEvent;
  onClickEditButton: (flag: boolean) => void;
  workSystem: string;
};
const format = (hours1, hours2, hours3, event) => {
  let isHave = false;
  if (Object.keys(event).length === 0) {
    if (hours1 === undefined && hours2 === undefined && hours3 === undefined) {
      return null;
    } else if (hours1 === null && hours2 === null && hours3 === null) {
      return null;
    }
  } else if (Object.keys(event).length > 0) {
    isHave = Object.keys(event).some((item) => event[item] !== null);
  }
  if (isHave) {
    if (!hours1) {
      hours1 = '--';
    }
    if (!hours2) {
      hours2 = '--';
    }
    if (!hours3) {
      hours3 = '--';
    }
    return (
      hours1 +
      TextUtil.template(msg().Com_Str_Parenthesis, hours2 + '・' + hours3) +
      msg().Com_Lbl_Hours
    );
  } else {
    return null;
  }
};

const formatTimes = (times1, times2, times3, event) => {
  let isHave = false;
  if (Object.keys(event).length === 0) {
    if (times1 === undefined && times2 === undefined && times3 === undefined) {
      return null;
    } else if (times1 === null && times2 === null && times3 === null) {
      return null;
    }
  } else if (Object.keys(event).length > 0) {
    isHave = Object.keys(event).some((item) => event[item] !== null);
  }
  if (isHave) {
    if (!times1) {
      times1 = '--';
    }
    if (!times2) {
      times2 = '--';
    }
    if (!times3) {
      times3 = '--';
    }
    return (
      times1 +
      TextUtil.template(msg().Com_Str_Parenthesis, times2 + '・' + times3) +
      msg().Admin_Lbl_Counts
    );
  } else {
    return null;
  }
};

const LimitHourList: React.FC<Props> = ({
  disabled,
  event,
  onClickEditButton,
  workSystem,
}) => {
  const list = [
    {
      oneMonthLimit: format(
        event.specialMonthlyOvertimeLimit,
        event.specialMonthlyOvertimeWarning1,
        event.specialMonthlyOvertimeWarning2,
        event
      ),
      oneYearLimit: format(
        event.specialYearlyOvertimeLimit,
        event.specialYearlyOvertimeWarning1,
        event.specialYearlyOvertimeWarning2,
        event
      ),
      averageLimit: format(
        event.specialMultiMonthOvertimeLimit,
        event.specialMultiMonthOvertimeWarning1,
        event.specialMultiMonthOvertimeWarning2,
        event
      ),
      extensionFrequencyLimit: formatTimes(
        event.specialExtensionCountLimit,
        event.specialExtensionCountWarning1,
        event.specialExtensionCountWarning2,
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
          overflowWrap: 'break-word',
        }}
      >
        {workSystem === 'Manager'
          ? msg().Admin_Lbl_OvertimeWorkInExcessOfLimitManager
          : msg().Admin_Lbl_OvertimeWorkInExcessOfLimit}
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
            key: 'oneMonthLimit',
            name: msg().Admin_Lbl_MonthlyOvertimeLimitWarn,
            width: 160,
            resizable: true,
          },
          {
            key: 'oneYearLimit',
            name: msg().Admin_Lbl_YearlyOvertimeLimitWarn,
            width: 160,
            resizable: true,
          },
          {
            key: 'averageLimit',
            name: msg().Admin_Lbl_MultiMonthAverageLimitWarn,
            width: 170,
            resizable: true,
          },
          {
            key: 'extensionFrequencyLimit',
            name: msg().Admin_Lbl_ExtensionCountLimitWarn,
            width: 170,
            resizable: true,
          },
        ]}
        rows={list}
      />
    </div>
  );
};

export default LimitHourList;
