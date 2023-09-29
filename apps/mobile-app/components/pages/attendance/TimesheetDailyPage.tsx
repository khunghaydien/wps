import React from 'react';

import msg from '../../../../commons/languages';
import Alert from '../../molecules/commons/Alert';

import { AttDailyRecord } from '../../../../domain/models/attendance/AttDailyRecord';
import { RestTimes } from '../../../../domain/models/attendance/RestTime';

import Layout from '../../../containers/organisms/attendance/TimesheetDailyLayoutContainer';

import Button from '../../atoms/Button';
import DailyDetailList from '../../organisms/attendance/DailyDetailList';

import './TimesheetDailyPage.scss';

const ROOT = 'mobile-app-pages-attendance-timesheet-daily-page';

export type Props = Readonly<{
  currentDate: string;
  isEditable: boolean;
  record: {
    startTime: number | null;
    endTime: number | null;
    restTimes: RestTimes;
    restHours: number | null;
    remarks: string;
    contractedDetail: AttDailyRecord['contractedDetail'];
    hasOtherRestTime: boolean;
    attentionMessages: string[];
    commuteForwardCount: number;
    commuteBackwardCount: number;
  };
  minRestTimesCount?: number;
  maxRestTimesCount?: number;
  useManageCommuteCount?: boolean;
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
  onClickRemoveRestTime: (arg0: number | null) => void;
  onClickAddRestTime: () => void;
  onChangeOtherRestTime: (arg0: number | null) => void;
  onChangeRemarks: (arg0: string) => void;
  onClickSave: () => void;
  onChangeCommuteCount: (
    commuteForwardCount: number,
    commuteBackwardCount: number
  ) => void;
}>;

export default class TimesheetDailyPage extends React.Component<Props> {
  render() {
    const { props } = this;
    return (
      <div className={`${ROOT}`} key={props.currentDate}>
        <Layout>
          <div className={`${ROOT}__package`}>
            {props.record.attentionMessages.length >= 1 && (
              <Alert
                className={`${ROOT}__alert`}
                variant="attention"
                message={props.record.attentionMessages}
              />
            )}
            <DailyDetailList
              key={props.currentDate}
              className={`${ROOT}__detail-list`}
              readOnly={!props.isEditable}
              startTime={props.record.startTime}
              endTime={props.record.endTime}
              restTimes={props.record.restTimes}
              otherRestTime={props.record.restHours}
              remarks={props.record.remarks}
              useManageCommuteCount={props.useManageCommuteCount}
              commuteForwardCount={props.record.commuteForwardCount}
              commuteBackwardCount={props.record.commuteBackwardCount}
              contractedDetail={props.record.contractedDetail}
              isShowOtherRestTime={props.record.hasOtherRestTime}
              minRestTimesCount={props.minRestTimesCount}
              maxRestTimesCount={props.maxRestTimesCount}
              onChangeStartTime={props.onChangeStartTime}
              onChangeEndTime={props.onChangeEndTime}
              onChangeRestTimeStartTime={props.onChangeRestTimeStartTime}
              onChangeRestTimeEndTime={props.onChangeRestTimeEndTime}
              onClickRemoveRestTime={props.onClickRemoveRestTime}
              onClickAddRestTime={props.onClickAddRestTime}
              onChangeOtherRestTime={props.onChangeOtherRestTime}
              onChangeRemarks={props.onChangeRemarks}
              onChangeCommuteCount={props.onChangeCommuteCount}
            />
            <div className={`${ROOT}__save-button-area`}>
              <Button
                priority="primary"
                variant="neutral"
                onClick={props.onClickSave}
                disabled={!props.isEditable}
              >
                {msg().Com_Btn_Save}
              </Button>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
