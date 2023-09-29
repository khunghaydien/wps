import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import DateRangeField from '../../../molecules/commons/Fields/DateRangeField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { AbsenceRequest } from '@attendance/domain/models/AttDailyRequest/AbsenceRequest';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import './AbsenceRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-absence-request-page';

export type Props = Readonly<{
  readOnly: boolean;
  request: AbsenceRequest;
  onChangeEndDate: (endDate: string) => void;
  onChangeReason: (reason: string) => void;
  validation: {
    [key: string]: string[];
  };
}>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFn = () => {};
export default class AbsenceRequestPage extends React.Component<Props> {
  render() {
    return (
      <Layout>
        <div className={`${ROOT}__item`}>
          <DateRangeField
            label={msg().Att_Lbl_Period}
            testId={`${ROOT}__date-range`}
            start={{
              readOnly: this.props.readOnly,
              disabled: !this.props.readOnly,
              value: this.props.request.startDate,
              onChange: emptyFn,
              errors: this.props.validation.startDate,
            }}
            end={{
              readOnly: this.props.readOnly,
              value: this.props.request.endDate,
              onChange: (e: React.ChangeEvent<HTMLElement>, { date }) =>
                this.props.onChangeEndDate(DateUtil.fromDate(date)),
            }}
          />
        </div>

        <div className={`${ROOT}__item`}>
          <TextAreaField
            label={msg().Att_Lbl_Reason}
            maxLength={255}
            value={this.props.request.reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              this.props.onChangeReason(e.target.value)
            }
            required
            errors={this.props.validation.reason}
            readOnly={this.props.readOnly}
          />
        </div>
      </Layout>
    );
  }
}
