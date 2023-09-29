import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { EarlyLeaveRequest } from '../../../../../domain/models/attendance/AttDailyRequest/EarlyLeaveRequest';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import Input from '../../../atoms/Fields/Input';
import Label from '../../../atoms/Label';
import AttTimeSelectField from '../../../molecules/attendance/AttTimeSelectField';

import './EarlyLeaveRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-early-leave-request-page';

export type Props = Readonly<{
  isLeavingOffice: boolean;
  readOnly: boolean;
  request: EarlyLeaveRequest;
  validation: {
    [key: string]: string[];
  };
  onChangeStartTime: (arg0: number | null) => void;
  onChangeReason: (arg0: string) => void;
}>;

export default class EarlyLeaveRequestPage extends React.Component<Props> {
  render() {
    const {
      isLeavingOffice,
      readOnly,
      request,
      validation,
      onChangeStartTime,
      onChangeReason,
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
            <AttTimeSelectField
              className={`${ROOT}__end-time`}
              placeholder="(00:00)"
              label={msg().Att_Lbl_ContractedEndTime}
              value={request.endTime}
              errors={validation.endTime}
              readOnly={readOnly}
              disabled={!readOnly}
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
          <div className={`${ROOT}__item`}>
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
          </div>
        </Layout>
      </div>
    );
  }
}
