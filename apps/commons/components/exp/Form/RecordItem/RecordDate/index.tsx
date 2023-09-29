import React from 'react';

import _ from 'lodash';

import CheckActive from '@commons/images/icons/check-active.svg';
import TextUtil from '@commons/utils/TextUtil';

import msg from '../../../../../languages';
import DateField from '../../../../fields/DateField';
import LabelWithHint from '../../../../fields/LabelWithHint';

type Props = {
  errors: { records?: any };
  hintMsg?: string;
  ocrDate?: string;
  readOnly: boolean;
  recordDate: string;
  targetRecord: string;
  onChangeRecordDate: (value: string) => void;
};
const ROOT = 'ts-expenses__form-record-item__record-date';

export default class RecordDate extends React.Component<Props> {
  render() {
    const { errors, targetRecord, hintMsg, recordDate, ocrDate } = this.props;

    const recordDateError = _.get(errors, `${targetRecord}.recordDate`);
    const isMatch = ocrDate === recordDate;
    const cssClass = isMatch ? 'ok' : '';
    const dateBaseMsg = isMatch
      ? msg().Exp_Msg_MatchedWithReceipt
      : msg().Exp_Msg_ManuallyEntered;
    const dateMsg = TextUtil.template(dateBaseMsg, msg().Exp_Clbl_Date);

    return (
      <div className="ts-text-field-container ts-record-date">
        <LabelWithHint
          text={msg().Exp_Clbl_Date}
          hintMsg={(!this.props.readOnly && hintMsg) || ''}
          isRequired
        />
        <DateField
          value={this.props.recordDate}
          onChange={this.props.onChangeRecordDate}
          disabled={this.props.readOnly}
          className="ts-date-picker-input"
          data-testid={ROOT}
        />
        {recordDateError && (
          <div className="input-feedback">{msg()[recordDateError]}</div>
        )}
        {!_.isNil(ocrDate) && (
          <div className={`input-feedback ${cssClass}`}>
            {isMatch && <CheckActive className="input-feedback-icon-ok" />}
            {dateMsg}
          </div>
        )}
      </div>
    );
  }
}
