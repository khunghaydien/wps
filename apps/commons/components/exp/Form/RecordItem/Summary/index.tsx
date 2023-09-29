import React from 'react';

import _ from 'lodash';

import msg from '../../../../../languages';
import LabelWithHint from '../../../../fields/LabelWithHint';
import TextAreaField from '../../../../fields/TextAreaField';

const ROOT = 'ts-expenses__form-record-item-summary';
type Props = {
  errors: { recordDate?: string; records?: Array<any> };
  hintMsg?: string;
  readOnly: boolean;
  targetRecord: string;
  touched: { recordDate?: string; records?: Array<any> };
  value: string;
  onChangeEditingExpReport: (arg0: string, arg1: any, arg2?: any) => void;
};

export default class Summary extends React.Component<Props> {
  render() {
    const {
      errors,
      touched,
      value,
      onChangeEditingExpReport,
      targetRecord,
      hintMsg,
    } = this.props;

    const remarksError = _.get(errors, `${targetRecord}.remarks`);
    const isRemarksTouched = _.get(touched, `${targetRecord}.remarks`);

    return (
      <div className={`${ROOT} ts-text-field-container`}>
        <LabelWithHint
          text={msg().Exp_Clbl_Summary}
          hintMsg={(!this.props.readOnly && hintMsg) || ''}
        />
        <TextAreaField
          data-testid={ROOT}
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeEditingExpReport(`${targetRecord}.remarks`, e.target.value)
          }
          disabled={this.props.readOnly}
        />
        {remarksError && isRemarksTouched && (
          <div className="value">
            <div className="input-feedback">{msg()[remarksError]}</div>
          </div>
        )}
      </div>
    );
  }
}
