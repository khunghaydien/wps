import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import SelectField from '../../../molecules/commons/Fields/SelectField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { EarlyLeaveRequest } from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';
import { EarlyLeaveReason } from '@attendance/domain/models/EarlyLeaveReason';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import Input from '../../../atoms/Fields/Input';
import Label from '../../../atoms/Label';
import ToggleButton from '../../../atoms/ToggleButton';
import AttTimeSelectField from '../../../molecules/attendance/AttTimeSelectField';

import './EarlyLeaveRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-early-leave-request-page';

export type Props = Readonly<{
  isLeavingOffice: boolean;
  readOnly: boolean;
  request: EarlyLeaveRequest;
  isFlexWithoutCoreNoWorkingTime: boolean;
  isFlexWithoutCore: boolean;
  personalReasonEarlyLeaveEndTime: number;
  objectiveReasonEarlyLeaveEndTime: number;
  earlyLeaveReasonOptions: {
    label: string;
    value: string;
  }[];
  selectedEarlyLeaveReason: EarlyLeaveReason | null;
  validation: {
    [key: string]: string[];
  };
  onChangeEndTime: (arg0: number | null) => void;
  onChangeStartTime: (arg0: number | null) => void;
  onChangeReason: (arg0: string) => void;
  onChangeReasonId: (arg0: string) => void;
  onChangeRemarks: (arg0: string) => void;
  onChangePersonalReason: (arg0: boolean) => void;
}>;

export default class EarlyLeaveRequestPage extends React.Component<Props> {
  render() {
    const {
      isLeavingOffice,
      readOnly,
      request,
      isFlexWithoutCoreNoWorkingTime,
      validation,
      earlyLeaveReasonOptions,
      onChangeStartTime,
      onChangeEndTime,
      onChangeReason,
      onChangeReasonId,
      onChangeRemarks,
      onChangePersonalReason,
    } = this.props;

    let tempTemplate = null;

    if (request.useEarlyLeaveReason) {
      tempTemplate = (
        <SelectField
          className={`${ROOT}__reason`}
          label={msg().Att_Lbl_Reason}
          options={earlyLeaveReasonOptions || []}
          readOnly={readOnly}
          value={request.reasonId}
          onChange={(e) => onChangeReasonId(e.currentTarget.value)}
          errors={validation.reasonId}
          required
        />
      );
    } else {
      tempTemplate = (
        <TextAreaField
          className={`${ROOT}__reason`}
          label={msg().Att_Lbl_Reason}
          rows={3}
          value={request.reason}
          onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) =>
            onChangeReason(event.currentTarget.value)
          }
          readOnly={readOnly}
          errors={validation.reason}
          required
        />
      );
    }

    return (
      <div className={ROOT}>
        <Layout>
          <div className={`${ROOT}__item`}>
            <Label className={`${ROOT}__date`} text={msg().Att_Lbl_Date}>
              <Input
                type="text"
                value={DateUtil.format(request.startDate)}
                readOnly={readOnly}
                disabled={!readOnly}
              />
            </Label>
          </div>
          <div className={`${ROOT}__item`}>
            <AttTimeSelectField
              className={`${ROOT}__end-time`}
              readOnly={readOnly}
              required={isFlexWithoutCoreNoWorkingTime}
              placeholder="(00:00)"
              label={msg().Att_Lbl_ContractedEndTime}
              value={request.endTime}
              onChange={onChangeEndTime}
              errors={validation.endTime}
              disabled={!readOnly && !isFlexWithoutCoreNoWorkingTime}
            />
          </div>
          <div className={`${ROOT}__item`}>
            <AttTimeSelectField
              className={`${ROOT}__start-time`}
              readOnly={readOnly}
              required
              placeholder="(00:00)"
              label={msg().Att_Lbl_EarlyLeaveStartTime}
              value={request.startTime}
              onChange={onChangeStartTime}
              errors={validation.startTime}
              disabled={!readOnly && isLeavingOffice}
            />
          </div>
          <div className={`${ROOT}__item`}>{tempTemplate}</div>
          {request.useEarlyLeaveReason ? (
            <TextAreaField
              className={`${ROOT}__remarks`}
              label={msg().Att_Lbl_Remarks}
              rows={3}
              value={request.remarks}
              onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) =>
                onChangeRemarks(event.currentTarget.value)
              }
              readOnly={readOnly}
              errors={validation.remarks}
            />
          ) : null}
          {request.useManagePersonalReason && !request.useEarlyLeaveReason ? (
            <div className={`${ROOT}__item`}>
              <Label
                className={`${ROOT}__personal-reason`}
                text={msg().Att_Lbl_PersonalReason}
              >
                <ToggleButton
                  value={request.personalReason}
                  disabled={readOnly}
                  onClick={(e) => {
                    if (readOnly) {
                      return false;
                    } else {
                      return onChangePersonalReason(e);
                    }
                  }}
                />
              </Label>
            </div>
          ) : null}
        </Layout>
      </div>
    );
  }
}
