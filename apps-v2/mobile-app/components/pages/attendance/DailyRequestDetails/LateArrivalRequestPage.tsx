import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import SelectField from '../../../molecules/commons/Fields/SelectField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { LateArrivalRequest } from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import Input from '../../../atoms/Fields/Input';
import Label from '../../../atoms/Label';
import ToggleButton from '../../../atoms/ToggleButton';
import AttTimeSelectField from '../../../molecules/attendance/AttTimeSelectField';

import './LateArrivalRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-late-arrival-request-page';

export type Props = Readonly<{
  isBeforeWorking: boolean;
  readOnly: boolean;
  request: LateArrivalRequest;
  lateArrivalReasonOptions: {
    label: string;
    value: string;
  }[];
  validation: {
    [key: string]: string[];
  };
  onChangeEndTime: (arg0: number | null) => void;
  onChangeReason: (arg0: string) => void;
  onChangeReasonId: (arg0: string) => void;
  onChangeRemarks: (arg0: string) => void;
  onChangePersonalReason: (arg0: boolean) => void;
}>;

export default class LateArrivalRequestPage extends React.Component<Props> {
  render() {
    const {
      isBeforeWorking,
      readOnly,
      request,
      validation,
      lateArrivalReasonOptions,
      onChangeEndTime,
      onChangeReason,
      onChangeReasonId,
      onChangeRemarks,
      onChangePersonalReason,
    } = this.props;
    let tempTemplate = null;
    if (request.useLateArrivalReason) {
      tempTemplate = (
        <SelectField
          className={`${ROOT}__reason`}
          label={msg().Att_Lbl_Reason}
          options={lateArrivalReasonOptions || []}
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
              className={`${ROOT}__start-time`}
              placeholder="(00:00)"
              label={msg().Att_Lbl_ContractedStartTime}
              value={request.startTime}
              errors={validation.startTime}
              readOnly={readOnly}
              disabled={!readOnly}
            />
          </div>
          <div className={`${ROOT}__item`}>
            <AttTimeSelectField
              className={`${ROOT}__end-time`}
              readOnly={readOnly}
              required
              placeholder="(00:00)"
              label={msg().Att_Lbl_LateArrivalStartTime}
              value={request.endTime}
              onChange={onChangeEndTime}
              errors={validation.endTime}
              disabled={!readOnly && !isBeforeWorking}
            />
          </div>
          <div className={`${ROOT}__item`}>{tempTemplate}</div>
          <div className={`${ROOT}__item`}>
            {request.useLateArrivalReason ? (
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
          </div>
          {request.useManagePersonalReason && !request.useLateArrivalReason ? (
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
