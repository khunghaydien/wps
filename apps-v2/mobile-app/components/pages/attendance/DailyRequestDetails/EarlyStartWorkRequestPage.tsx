import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { EarlyStartWorkRequest } from '@attendance/domain/models/AttDailyRequest/EarlyStartWorkRequest';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import Input from '../../../atoms/Fields/Input';
import Label from '../../../atoms/Label';
import AttTimeSelectRangeField from '../../../molecules/attendance/AttTimeSelectRangeField';

import './EarlyStartWorkRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-early-start-work-request-page';

export type Props = Readonly<{
  readOnly: boolean;
  request: EarlyStartWorkRequest;
  validation: {
    [key: string]: string[];
  };
  onChangeStartTime: (arg0: number | null, arg1: number | null) => void;
  onChangeEndTime: (arg0: number | null, arg1: number | null) => void;
  onChangeRemarks: (arg0: string) => void;
}>;

export default class EarlyStartWorkRequestPage extends React.Component<Props> {
  render() {
    const {
      readOnly,
      request,
      validation,
      onChangeStartTime,
      onChangeEndTime,
      onChangeRemarks,
    } = this.props;

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
            <AttTimeSelectRangeField
              className={`${ROOT}__time-range`}
              readOnly={readOnly}
              required
              placeholder="(00:00)"
              from={{
                label: msg().Att_Lbl_StartTime,
                value: request.startTime,
                onChangeValue: onChangeStartTime,
              }}
              to={{
                label: msg().Att_Lbl_EndTime,
                value: request.endTime,
                onChangeValue: onChangeEndTime,
              }}
              errors={validation.startTime || validation.endTime}
            />
          </div>
          <div className={`${ROOT}__item`}>
            <TextAreaField
              className={`${ROOT}__remarks`}
              label={msg().Att_Lbl_Remarks}
              rows={3}
              value={request.remarks}
              onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) =>
                onChangeRemarks(event.currentTarget.value)
              }
              readOnly={readOnly}
            />
          </div>
        </Layout>
      </div>
    );
  }
}
