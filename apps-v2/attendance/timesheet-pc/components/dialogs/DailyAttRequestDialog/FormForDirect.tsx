import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { TextField } from '../../../../../core';

import { DirectRequest } from '@attendance/domain/models/AttDailyRequest/DirectRequest';

import AttTimeRangeField from '../fields/AttTimeRangeField';
import DateRangeField from '../fields/DateRangeField';
import DirectApplyRestTimeRangeFormRows from './DirectApplyRestTimeRangeFormRows';
import FormRow from './FormRow';
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

const createRestTimesFactory = $createRestTimesFactory();

export type Props = {
  // state
  isReadOnly: boolean;
  targetRequest: DirectRequest;
  hasRange: boolean;
  maxRestTimesCount: number;

  // actions
  onUpdateHasRange: (arg0: boolean) => void;
  onUpdateValue: (
    arg0: keyof DirectRequest,
    arg1: DirectRequest[keyof DirectRequest]
  ) => void;
};

export const FormForDirect = (props: Props) => {
  const {
    isReadOnly,
    targetRequest,
    hasRange,
    maxRestTimesCount,
    onUpdateHasRange,
    onUpdateValue,
  } = props;
  const RestTimesFactory = React.useMemo(() => createRestTimesFactory(), []);
  const minOfEndDate = DateUtil.addDays(targetRequest.startDate, 1);
  const directApplyRestTimes =
    isReadOnly && targetRequest.directApplyRestTimes.length > 1
      ? RestTimesFactory.filter(targetRequest.directApplyRestTimes)
      : targetRequest.directApplyRestTimes;

  return (
    <div>
      <FormRow labelText={msg().Att_Lbl_Period}>
        <DateRangeField
          startDateFieldProps={{
            disabled: true,
            showsIcon: false,
            value: targetRequest.startDate,
            onChange: (value) => onUpdateValue('startDate', value),
          }}
          endDateFieldProps={{
            disabled: isReadOnly,
            showsIcon: !isReadOnly,
            value: targetRequest.endDate,
            selected: targetRequest.endDate,
            minDate: minOfEndDate,
            onChange: (value) => onUpdateValue('endDate', value),
          }}
          onChangeHasRange={onUpdateHasRange}
          hasRange={hasRange}
          disabled={isReadOnly}
          required
        />
      </FormRow>

      <FormRow labelText={msg().Att_Lbl_WorkTime}>
        <AttTimeRangeField
          startTime={{
            value: TimeUtil.toHHmm(targetRequest.startTime),
            onBlur: (value) =>
              onUpdateValue('startTime', TimeUtil.parseMinutes(value)),
          }}
          endTime={{
            value: TimeUtil.toHHmm(targetRequest.endTime),
            onBlur: (value) =>
              onUpdateValue('endTime', TimeUtil.parseMinutes(value)),
          }}
          disabled={isReadOnly}
          required
        />
      </FormRow>

      <DirectApplyRestTimeRangeFormRows
        directApplyRestTimes={directApplyRestTimes}
        maxRestTimesCount={maxRestTimesCount}
        onUpdateValue={onUpdateValue}
        isReadOnly={isReadOnly}
      />

      <FormRow labelText={msg().Att_Lbl_Remarks}>
        <TextField
          maxLength={255}
          minRows={3}
          value={targetRequest.remarks || ''}
          onChange={(e: React.SyntheticEvent<HTMLTextAreaElement>) =>
            onUpdateValue('remarks', e.currentTarget.value)
          }
          readOnly={isReadOnly}
        />
      </FormRow>
    </div>
  );
};

export default FormForDirect;
