import React from 'react';

import DateUtil from '../../../../../../../utils/DateUtil';

import msg from '../../../../../../../languages';
import DateField from '../../../../../../fields/DateField';
import LabelWithHint from '../../../../../../fields/LabelWithHint';

type Props = {
  // ui states
  errors: {
    purpose: string;
    scheduledDate: string;
    subject: string;
  };
  expReport: any;
  hintMsg?: string;
  readOnly: boolean;
  touched: {
    purpose: string;
    records?: Array<any>;
    scheduledDate: string;
    subject: string;
  };
  // HOC props
  onChangeScheduledDate: (date: string) => void;
};

const ROOT = 'ts-expenses__form-report-summary__form__scheduled-date';

// this class is only used in expense request (not in expense report)
export default class ScheduledDate extends React.Component<Props> {
  render() {
    const { errors, touched, hintMsg, readOnly } = this.props;

    return (
      <React.Fragment>
        <div className="ts-text-field-container">
          <LabelWithHint
            text={msg().Exp_Clbl_ScheduledDate}
            hintMsg={(!readOnly && hintMsg) || ''}
            isRequired
          />
          <DateField
            data-testid={ROOT}
            value={DateUtil.format(
              this.props.expReport.scheduledDate,
              'YYYY-MM-DD'
            )}
            onChange={this.props.onChangeScheduledDate}
            disabled={readOnly}
          />
        </div>
        {errors.scheduledDate && touched.scheduledDate && (
          <div className="input-feedback">{msg()[errors.scheduledDate]}</div>
        )}
      </React.Fragment>
    );
  }
}
