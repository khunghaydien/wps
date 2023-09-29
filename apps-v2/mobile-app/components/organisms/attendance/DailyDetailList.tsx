import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import TextAreaField from '../../molecules/commons/Fields/TextAreaField';
import { Dropdown } from '@apps/core';

import { AttDailyRecordContractedDetail } from '@attendance/domain/models/AttDailyRecord';
import {
  CommuteCount,
  toCommuteCount,
  toCommuteState,
} from '@attendance/domain/models/CommuteCount';
import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';
import * as WorkingType from '@attendance/domain/models/WorkingType';

import {
  RestTime,
  RestTimes,
} from '@mobile/modules/attendance/timesheet/ui/daily/editing';

import Label from '../../atoms/Label';
import AttTimeList from './CustomAttTimeList';
import * as commuteCountHelper from '@attendance/ui/helpers/dailyRecord/commuteCount';

import './DailyDetailList.scss';

const ROOT = 'mobile-app-components-organisms-attendance-daily-detail-list';

type Props = Readonly<{
  className?: string;
  readOnly: boolean;
  startTime: number | null;
  endTime: number | null;
  restTimeReasons: RestTimeReason[];
  restTimes: RestTimes;
  remarks: string;
  otherRestTime: number | null;
  otherRestReason: RestTimeReason | null;
  contractedDetail: AttDailyRecordContractedDetail;
  isShowOtherRestTime: boolean;
  minRestTimesCount?: number;
  maxRestTimesCount?: number;
  commuteCount?: CommuteCount;
  workingType: WorkingType.WorkingType;
  onChangeStartTime: (arg0: number | null) => void;
  onChangeEndTime: (arg0: number | null) => void;
  onChangeRestTime: (index: number, value: RestTime | null) => void;
  onClickRemoveRestTime: (index: number) => void;
  onClickAddRestTime: () => void;
  onChangeOtherRestTime: (arg0: number | null) => void;
  onChangeOtherRestReason: (arg0: RestTimeReason | null) => void;
  onChangeCommuteCount: (arg0: CommuteCount) => void;
  onChangeRemarks: (arg0: string) => void;
}>;

export default class DailyDetailList extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const {
      readOnly,
      startTime,
      endTime,
      restTimes,
      restTimeReasons,
      otherRestTime,
      otherRestReason,
      remarks,
      contractedDetail,
      isShowOtherRestTime,
      minRestTimesCount,
      maxRestTimesCount,
      commuteCount,
      workingType,
      onChangeStartTime,
      onChangeEndTime,
      onChangeRestTime,
      onClickAddRestTime,
      onClickRemoveRestTime,
      onChangeOtherRestTime,
      onChangeOtherRestReason,
      onChangeCommuteCount,
      onChangeRemarks,
    } = this.props;

    return (
      <div className={className}>
        <AttTimeList
          readOnly={readOnly}
          enabledRestReason={workingType?.useRestReason}
          workingTime={{
            from: {
              placeholder:
                !readOnly && contractedDetail?.startTime !== null
                  ? `(${TimeUtil.toHHmm(contractedDetail.startTime)})`
                  : undefined,
              defaultValue: contractedDetail.startTime,
              value: startTime,
              onChangeValue: (from, _to) => {
                if (onChangeStartTime) {
                  onChangeStartTime(from);
                }
              },
            },
            to: {
              placeholder:
                !readOnly && contractedDetail?.endTime !== null
                  ? `(${TimeUtil.toHHmm(contractedDetail.endTime)})`
                  : undefined,
              defaultValue: contractedDetail.endTime,
              value: endTime,
              onChangeValue: (_from, to) => {
                if (onChangeEndTime) {
                  onChangeEndTime(to);
                }
              },
            },
          }}
          restTimeReasons={restTimeReasons}
          restTimes={{
            placeholder: !readOnly
              ? (contractedDetail.restTimes.map((o) => ({
                  startTime: `(${TimeUtil.toHHmm(o.startTime)})`,
                  endTime: `(${TimeUtil.toHHmm(o.endTime)})`,
                })) as {
                  startTime: string;
                  endTime: string;
                }[])
              : undefined,
            defaultValue: contractedDetail.restTimes.map((o) => ({
              startTime: o.startTime,
              endTime: o.endTime,
            })) as { startTime: number | null; endTime: number | null }[],
            value: restTimes,
            min: minRestTimesCount,
            max: maxRestTimesCount,
            onChangeValue: onChangeRestTime,
            onClickRemove: onClickRemoveRestTime,
            onClickAdd: onClickAddRestTime,
          }}
          otherRestTime={
            isShowOtherRestTime
              ? {
                  value: otherRestTime,
                  onChange: onChangeOtherRestTime,
                }
              : undefined
          }
          otherRestReason={
            isShowOtherRestTime
              ? {
                  value: otherRestReason,
                  onChange: onChangeOtherRestReason,
                }
              : undefined
          }
        />
        {workingType?.useManageCommuteCount && (
          <div className={`${ROOT}__item`}>
            <Label
              className={`${ROOT}__commute-count`}
              text={msg().Att_Lbl_CommuteCountCommute}
            >
              <Dropdown
                value={toCommuteState(commuteCount)}
                options={commuteCountHelper.options()}
                onSelect={({ value }) => {
                  onChangeCommuteCount(toCommuteCount(value));
                }}
                readOnly={readOnly}
              />
            </Label>
          </div>
        )}
        <div className={`${ROOT}__item`}>
          <TextAreaField
            className={`${ROOT}__remarks`}
            label={msg().Att_Lbl_Remarks}
            rows={3}
            value={remarks}
            onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) =>
              onChangeRemarks(event.currentTarget.value)
            }
            readOnly={readOnly}
          />
        </div>
      </div>
    );
  }
}
