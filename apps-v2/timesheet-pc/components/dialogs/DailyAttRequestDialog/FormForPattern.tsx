import * as React from 'react';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { Dropdown, Text, TextField } from '../../../../core';

import { PatternRequest } from '../../../../domain/models/attendance/AttDailyRequest/PatternRequest';
import { AttPattern } from '../../../../domain/models/attendance/AttPattern';

import RangeMark from '../../../images/rangeMark.svg';
import DateRangeField from '../fields/DateRangeField';
import FormRow from './FormRow';

import './FormForPattern.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-for-pattern';

export type Props = {
  // state
  isReadOnly: boolean;
  targetRequest: PatternRequest;
  attPatternList: AttPattern[];
  selectedAttPattern: AttPattern | null;
  hasRange: boolean;

  // actions
  onUpdateHasRange: (arg0: boolean) => void;
  onUpdateValue: (arg0: keyof PatternRequest, arg1: string | number) => void;
};

const TimeRange = ({
  startTime,
  endTime,
}: {
  startTime: number | null;
  endTime: number | null;
}) => (
  <div className={`${ROOT}__time-range`}>
    <Text size="large">{TimeUtil.toHHmm(startTime)}</Text>
    <div className={`${ROOT}__range-mark`}>
      <RangeMark />
    </div>
    <Text size="large">{TimeUtil.toHHmm(endTime)}</Text>
  </div>
);

export default (props: Props) => {
  const {
    isReadOnly,
    targetRequest,
    attPatternList,
    hasRange,
    onUpdateHasRange,
    onUpdateValue,
  } = props;
  const selectedAttPattern: AttPattern = props.selectedAttPattern || {
    name: '',
    code: '',
    startTime: null,
    endTime: null,
    restTimes: [],
  };
  const minOfEndDate = DateUtil.addDays(targetRequest.startDate, 1);

  return (
    <div className={ROOT}>
      <FormRow labelText={msg().Att_Lbl_Period}>
        <DateRangeField
          startDateFieldProps={{
            disabled: true,
            showsIcon: false,
            value: targetRequest.startDate,
            selected: targetRequest.startDate,
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

      <FormRow labelText={msg().Att_Lbl_AttPattern}>
        <Dropdown
          options={attPatternList.map(({ name, code }) => ({
            label: name,
            value: code,
          }))}
          value={targetRequest.patternCode}
          onSelect={(e) => onUpdateValue('patternCode', e.value)}
          readOnly={isReadOnly}
        />
      </FormRow>

      <FormRow labelText={msg().Admin_Lbl_WorkingHours}>
        <TimeRange
          startTime={selectedAttPattern.startTime}
          endTime={selectedAttPattern.endTime}
        />
      </FormRow>

      {selectedAttPattern.restTimes.map((restTime, idx) => (
        <FormRow
          key={idx}
          labelText={`${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`}
        >
          <TimeRange
            startTime={restTime.startTime}
            endTime={restTime.endTime}
          />
        </FormRow>
      ))}

      <FormRow labelText={msg().Att_Lbl_Remarks}>
        <TextField
          maxLength={255}
          minRows={3}
          value={targetRequest.remarks || ''}
          onChange={(e) => onUpdateValue('remarks', e.target.value)}
          readOnly={isReadOnly}
        />
      </FormRow>
    </div>
  );
};
