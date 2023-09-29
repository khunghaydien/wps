import React from 'react';

import AttTimeField from '../../../../../commons/components/fields/AttTimeField';
import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { CheckBox, Dropdown, Text, TextField } from '../../../../../core';

import { EarlyLeaveRequest } from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';
import { EarlyLeaveReason } from '@attendance/domain/models/EarlyLeaveReason';

import FormRow from './FormRow';

const ROOT =
  'timesheet-pc-dialogs-daily-att-request-dialog-form-for-early-leave';

type Props = Readonly<{
  isReadOnly: boolean;
  isLeavingOffice: boolean;
  targetRequest: EarlyLeaveRequest;
  isFlexWithoutCoreNoWorkingTime: boolean;
  isFlexWithoutCore: boolean;
  personalReasonEarlyLeaveEndTime: number;
  objectiveReasonEarlyLeaveEndTime: number;
  earlyLeaveReasonList: EarlyLeaveReason[];
  selectedEarlyLeaveReason: EarlyLeaveReason | null;
  onUpdateValue: (
    arg0: keyof EarlyLeaveRequest,
    arg1: EarlyLeaveRequest[keyof EarlyLeaveRequest]
  ) => void;
}>;

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
    'isReadOnly' | 'targetRequest' | 'earlyLeaveReasonList' | 'onUpdateValue'
  >
> = ({ isReadOnly, targetRequest, earlyLeaveReasonList, onUpdateValue }) => {
  const options = React.useMemo(
    () =>
      earlyLeaveReasonList.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    [earlyLeaveReasonList]
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

export default class FormForEarlyLeave extends React.Component<Props> {
  render() {
    const {
      isReadOnly,
      isLeavingOffice,
      targetRequest,
      isFlexWithoutCoreNoWorkingTime,
      earlyLeaveReasonList,
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
          key="endTime"
          labelText={msg().Att_Lbl_ContractedEndTime}
          height="thin"
        >
          {isFlexWithoutCoreNoWorkingTime ? (
            <AttTimeField
              value={TimeUtil.toHHmm(targetRequest.endTime)}
              onBlur={(value) =>
                onUpdateValue('endTime', TimeUtil.toMinutes(value))
              }
              disabled={isReadOnly}
              required
            />
          ) : (
            <Text size="large">{TimeUtil.toHHmm(targetRequest.endTime)}</Text>
          )}
        </FormRow>

        <FormRow key="startTime" labelText={msg().Att_Lbl_EarlyLeaveStartTime}>
          <AttTimeField
            value={TimeUtil.toHHmm(targetRequest.startTime)}
            onBlur={(value) =>
              onUpdateValue('startTime', TimeUtil.toMinutes(value))
            }
            disabled={isLeavingOffice || isReadOnly}
            required
          />
        </FormRow>

        {targetRequest.useEarlyLeaveReason ? (
          <ReasonForManagedReason
            {...{
              isReadOnly,
              targetRequest,
              earlyLeaveReasonList,
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
