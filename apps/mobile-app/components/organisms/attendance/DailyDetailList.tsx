import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { Dropdown } from '../../../../core';
import TextAreaField from '../../molecules/commons/Fields/TextAreaField';

import { AttDailyRecordContractedDetail } from '../../../../domain/models/attendance/AttDailyRecord';
import {
  COMMUTE_STATE,
  toCommuteCount,
  toCommuteState,
} from '../../../../domain/models/attendance/CommuteCount';
import { RestTimes } from '../../../../domain/models/attendance/RestTime';

import Label from '../../atoms/Label';
import AttTimeList from './AttTimeList';

import './DailyDetailList.scss';

const ROOT = 'mobile-app-components-organisms-attendance-daily-detail-list';

type Props = Readonly<{
  className?: string;
  readOnly: boolean;
  startTime: number | null;
  endTime: number | null;
  restTimes: RestTimes;
  remarks: string;
  otherRestTime: number | null;
  contractedDetail: AttDailyRecordContractedDetail;
  isShowOtherRestTime: boolean;
  minRestTimesCount?: number;
  maxRestTimesCount?: number;
  useManageCommuteCount?: boolean;
  commuteForwardCount?: number;
  commuteBackwardCount?: number;
  onChangeStartTime: (arg0: number | null) => void;
  onChangeEndTime: (arg0: number | null) => void;
  onChangeRestTimeStartTime: (
    arg0: number,
    arg1: number | null,
    arg2: number | null
  ) => void;
  onChangeRestTimeEndTime: (
    arg0: number,
    arg1: number | null,
    arg2: number | null
  ) => void;
  onClickRemoveRestTime: (arg0: number) => void;
  onClickAddRestTime: () => void;
  onChangeOtherRestTime: (arg0: number | null) => void;
  onChangeRemarks: (arg0: string) => void;
  onChangeCommuteCount: (
    commuteForwardCount: number,
    commuteBackwardCount: number
  ) => void;
}>;

export default class DailyDetailList extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const {
      readOnly,
      startTime,
      endTime,
      restTimes,
      otherRestTime,
      remarks,
      contractedDetail,
      isShowOtherRestTime,
      minRestTimesCount,
      maxRestTimesCount,
      useManageCommuteCount,
      commuteForwardCount,
      commuteBackwardCount,
      onChangeStartTime,
      onChangeEndTime,
      onChangeRestTimeStartTime,
      onChangeRestTimeEndTime,
      onClickRemoveRestTime,
      onClickAddRestTime,
      onChangeOtherRestTime,
      onChangeRemarks,
      onChangeCommuteCount,
    } = this.props;

    return (
      <div className={className}>
        <AttTimeList
          readOnly={readOnly}
          workingTime={{
            from: {
              placeholder:
                !readOnly && contractedDetail.startTime !== null
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
                !readOnly && contractedDetail.endTime !== null
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
            onChangeValueStartTime: onChangeRestTimeStartTime,
            onChangeValueEndTime: onChangeRestTimeEndTime,
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
        />
        {useManageCommuteCount && (
          <div className={`${ROOT}__item`}>
            <Label
              className={`${ROOT}__commute-count`}
              text={msg().Att_Lbl_CommuteCountCommute}
            >
              <Dropdown
                value={toCommuteState(
                  commuteForwardCount,
                  commuteBackwardCount
                )}
                options={[
                  {
                    value: COMMUTE_STATE.UNENTERED,
                    label: msg().Att_Lbl_CommuteCountUnentered,
                  },
                  {
                    value: COMMUTE_STATE.NONE,
                    label: msg().Att_Lbl_CommuteCountNone,
                  },
                  {
                    value: COMMUTE_STATE.BOTH_WAYS,
                    label: msg().Att_Lbl_CommuteCountBothWays,
                  },
                  {
                    value: COMMUTE_STATE.FORWARD,
                    label: msg().Att_Lbl_CommuteCountForward,
                  },
                  {
                    value: COMMUTE_STATE.BACKWARD,
                    label: msg().Att_Lbl_CommuteCountBackward,
                  },
                ]}
                onSelect={(option) => {
                  const { value } = option;
                  const [commuteForwardCount, commuteBackwardCount] =
                    toCommuteCount(value);
                  onChangeCommuteCount(
                    commuteForwardCount,
                    commuteBackwardCount
                  );
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
