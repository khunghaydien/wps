import React from 'react';

import AttTimeField from '../../../../../commons/components/fields/AttTimeField';
import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { CheckBox, Dropdown, Text, TextField } from '../../../../../core';

import { LateArrivalRequest } from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';
import { LateArrivalReason } from '@attendance/domain/models/LateArrivalReason';

import FormRow from './FormRow';

const ROOT =
  'timesheet-pc-dialogs-daily-att-request-dialog-form-for-late-arrival';

type Props = {
  isReadOnly: boolean;
  isBeforeWorking: boolean;
  targetRequest: LateArrivalRequest;
  lateArrivalReasonList: LateArrivalReason[];
  onUpdateValue: (
    arg0: keyof LateArrivalRequest,
    arg1: LateArrivalRequest[keyof LateArrivalRequest]
  ) => void;
};

const ReasonForDefault: React.FC<
  Pick<Props, 'isReadOnly' | 'targetRequest' | 'onUpdateValue'>
> = ({ isReadOnly, targetRequest, onUpdateValue }) => {
  return (
    <>
      <FormRow key="reason" labelText={msg().Att_Lbl_Reason}>
        <TextField
          maxLength={255}
          minRows={3}
          value={targetRequest.reason || ''}
          onChange={(e) => onUpdateValue('reason', e.target.value)}
          readOnly={isReadOnly}
          required
        />
      </FormRow>

      {targetRequest.useManagePersonalReason && (
        <FormRow key="personalReason" labelText={msg().Att_Lbl_PersonalReason}>
          <CheckBox
            checked={targetRequest.personalReason}
            onChange={(e) => onUpdateValue('personalReason', e.target.checked)}
            disabled={isReadOnly}
          />
        </FormRow>
      )}
    </>
  );
};

const ReasonForManagedReason: React.FC<
  Pick<
    Props,
    'isReadOnly' | 'targetRequest' | 'lateArrivalReasonList' | 'onUpdateValue'
  >
> = ({ isReadOnly, targetRequest, lateArrivalReasonList, onUpdateValue }) => {
  const options = React.useMemo(
    () =>
      lateArrivalReasonList.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    [lateArrivalReasonList]
  );

  return (
    <>
      <FormRow key="reason" labelText={msg().Att_Lbl_Reason}>
        <Dropdown
          options={options}
          value={targetRequest.reasonId}
          onSelect={(e) => onUpdateValue('reasonId', e.value)}
          readOnly={isReadOnly}
          required
        />
      </FormRow>

      <FormRow labelText={msg().Att_Lbl_Remarks}>
        <TextField
          maxLength={255}
          minRows={3}
          value={targetRequest.remarks || ''}
          onChange={(e) => onUpdateValue('remarks', e.target.value)}
          readOnly={isReadOnly}
        />
      </FormRow>
    </>
  );
};

export default class FormForLateArrival extends React.Component<Props> {
  render() {
    const {
      isReadOnly,
      isBeforeWorking,
      targetRequest,
      lateArrivalReasonList,
      onUpdateValue,
    } = this.props;

    return (
      <div className={ROOT}>
        <FormRow key="date" labelText={msg().Att_Lbl_Date} height="thin">
          <Text size="large">
            {DateUtil.formatYMD(targetRequest.startDate)}
          </Text>
        </FormRow>

        <FormRow
          key="startTime"
          labelText={msg().Att_Lbl_ContractedStartTime}
          height="thin"
        >
          <Text size="large">{TimeUtil.toHHmm(targetRequest.startTime)}</Text>
        </FormRow>

        <FormRow key="endTime" labelText={msg().Att_Lbl_LateArrivalStartTime}>
          <AttTimeField
            value={TimeUtil.toHHmm(targetRequest.endTime)}
            onBlur={(value) =>
              onUpdateValue('endTime', TimeUtil.toMinutes(value))
            }
            disabled={!isBeforeWorking || isReadOnly}
            required
          />
        </FormRow>

        {targetRequest.useLateArrivalReason ? (
          <ReasonForManagedReason
            {...{
              isReadOnly,
              targetRequest,
              lateArrivalReasonList,
              onUpdateValue,
            }}
          />
        ) : (
          <ReasonForDefault
            {...{
              isReadOnly,
              targetRequest,
              onUpdateValue,
            }}
          />
        )}
      </div>
    );
  }
}
