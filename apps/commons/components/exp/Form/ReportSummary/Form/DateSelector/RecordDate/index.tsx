import React from 'react';

import msg from '../../../../../../../languages';
import DateField from '../../../../../../fields/DateField';
import LabelWithHint from '../../../../../../fields/LabelWithHint';
import MultiColumnsGrid from '../../../../../../MultiColumnsGrid';

type Props = {
  // ui states
  errors: {
    accountingDate: string;
    subject: string;
  };
  expReport: any;
  hintMsg?: string;
  readOnly: boolean;
  touched: {
    accountingDate: string;
    records?: Array<any>;
    subject: string;
  };
  // HOC props
  onChangeRecordDate: (date: string) => void;
};

const ROOT = 'ts-expenses__form-report-summary__form__record-date';

// this class is only used in expense request (not in expense report)
export default class RecordDate extends React.Component<Props> {
  render() {
    const { errors, touched, hintMsg, readOnly } = this.props;

    return (
      <React.Fragment>
        <MultiColumnsGrid alignments={['top', 'middle']} sizeList={[6, 6]}>
          <div className="ts-text-field-container">
            <LabelWithHint
              text={msg().Exp_Clbl_RecordDate}
              hintMsg={(!readOnly && hintMsg) || ''}
              isRequired
            />
            <DateField
              value={this.props.expReport.accountingDate}
              onChange={this.props.onChangeRecordDate}
              disabled={readOnly}
              data-testid={ROOT}
            />
          </div>
        </MultiColumnsGrid>
        {errors.accountingDate && touched.accountingDate && (
          <div className="input-feedback">{msg()[errors.accountingDate]}</div>
        )}
      </React.Fragment>
    );
  }
}
