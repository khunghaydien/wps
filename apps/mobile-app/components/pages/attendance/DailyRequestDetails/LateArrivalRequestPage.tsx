import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { LateArrivalRequest } from '../../../../../domain/models/attendance/AttDailyRequest/LateArrivalRequest';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import Input from '../../../atoms/Fields/Input';
import Label from '../../../atoms/Label';
import AttTimeSelectField from '../../../molecules/attendance/AttTimeSelectField';

import './LateArrivalRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-late-arrival-request-page';

export type Props = Readonly<{
  isBeforeWorking: boolean;
  readOnly: boolean;
  request: LateArrivalRequest;
  validation: {
    [key: string]: string[];
  };
  onChangeEndTime: (arg0: number | null) => void;
  onChangeReason: (arg0: string) => void;
}>;

export default class LateArrivalRequestPage extends React.Component<Props> {
  render() {
    const {
      isBeforeWorking,
      readOnly,
      request,
      validation,
      onChangeEndTime,
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
