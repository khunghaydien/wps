import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import DateField from '../../../atoms/Fields/DateField';
import IconButton from '../../../atoms/IconButton';
import LabelWithHint from '../../../atoms/LabelWithHint';

import './SFDateField.scss';

const ROOT = 'mobile-app-molecules-commons-sf-date-field';

export type Props = Readonly<{
  emphasis?: boolean;
  errors?: string[];
  label?: string;
  testId?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
  useRemoveValueButton?: boolean;
  onClickRemoveValueButton?: () => void;
  onChange?: (
    arg0: React.SyntheticEvent<any>,
    arg1: { date: Date; formattedDate: string; timezoneOffset: number }
  ) => void | Promise<any>;
  onBlur?: (arg0: React.SyntheticEvent<any>) => void;
  // Custom Hint
  hintMsg?: string;
  isShowHint?: boolean;
  onClickHint?: () => void;
}>;

const SFDateField = (props: Props) => {
  const errors = props.errors || [];
  const hasErrors = errors.length > 0;
  const dateFieldClassName = classNames({
    [`${ROOT}__date-field`]: true,
    [`${ROOT}__date-field--has-remove`]: props.useRemoveValueButton,
  });

  return (
    <div className={ROOT}>
      {props.label && (
        <LabelWithHint
          className={`${ROOT}__label`}
          text={props.label}
          marked={props.required}
          emphasis={props.emphasis}
          hintMsg={props.hintMsg}
          isShowHint={props.isShowHint}
          onClickHint={props.onClickHint}
        />
      )}
      <div className={`${ROOT}__main`}>
        <DateField
          className={dateFieldClassName}
          value={props.value}
          testId={props.testId}
          readOnly={props.readOnly}
          required={props.required}
          disabled={props.disabled}
          onChange={props.onChange}
          onBlur={props.onBlur}
          placeholder={props.placeholder}
          error={hasErrors}
        />
        {props.useRemoveValueButton && (
          <IconButton
            className={`${ROOT}__icon-button`}
            icon="clear"
            onClick={props.onClickRemoveValueButton}
            disabled={props.disabled}
            readOnly={props.readOnly}
          />
        )}
      </div>
      {hasErrors && <Errors messages={errors} />}
    </div>
  );
};

export default SFDateField;
