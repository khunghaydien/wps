import React from 'react';

import classNames from 'classnames';
import { isEmpty } from 'lodash';

import msg from '../../../../../languages';
import SelectField from '../../../../fields/SelectField';

type Props = {
  className?: string;
  error: string;
  options: Array<Record<string, any>>;
  readOnly?: boolean;
  value: string;
  onChangeAmountSelection: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
};

const ROOT = 'ts-expenses__form-record-item__amount';

export default class AmountSelection extends React.Component<Props> {
  render() {
    const {
      options,
      value,
      readOnly,
      error,
      className,
      onChangeAmountSelection,
    } = this.props;

    const optionList =
      options.map((item) => ({
        value: item.id,
        text: item.text,
      })) || [];
    return (
      <div className="record_item__contents__amount_selection">
        <p className="key">
          <span className="is-required">*</span>
          &nbsp;{msg().Exp_Lbl_AmountSelection}
        </p>

        <SelectField
          className={classNames('ts-select-input', className)}
          data-testid={ROOT}
          onChange={onChangeAmountSelection}
          options={optionList}
          value={value}
          disabled={readOnly}
          required
        />
        {!isEmpty(error) && <div className="input-feedback">{error}</div>}
      </div>
    );
  }
}
