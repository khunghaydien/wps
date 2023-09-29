import * as React from 'react';

import classNames from 'classnames';

import { parseIntOrNull } from '../../../../commons/utils/NumberUtil';

import Errors from '../../atoms/Errors';
import Icon from '../../atoms/Icon';
import Label from '../../atoms/Label';
import AttTimeSelect from './AttTimeSelect';

import './AttTimeSelectRangeField.scss';

const ROOT =
  'mobile-app-components-molecules-attendance-att-time-select-range-field';

export type TimeFieldProps = Readonly<{
  label?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  value?: number | null;
  defaultValue?: number | null;
  placeholder?: string;
  errors?: string[];
  onChangeValue?: (arg0: number | null, arg1: number | null) => void;
}>;

export type Props = Readonly<{
  testId?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  errors?: string[];
  label?: string;
  from: TimeFieldProps;
  to: TimeFieldProps;
  actions?: React.ReactElement<any>[];
  separator?: React.ReactNode;
}>;

export default (props: Props) => {
  const errors = props.errors || [];
  const fromErrors = props.from.errors || [];
  const toErrors = props.to.errors || [];
  const hasFromErrors = fromErrors.length > 0;
  const hasToErrors = toErrors.length > 0;
  const hasErrors = errors.length > 0;
  const className = classNames(ROOT, props.className, {
    [`${ROOT}--error`]: hasErrors,
    [`${ROOT}--from-error`]: hasFromErrors,
    [`${ROOT}--to-error`]: hasToErrors,
  });
  const testId = props.testId
    ? {
        from: `${props.testId}__from`,
        to: `${props.testId}__to`,
      }
    : {};

  return (
    <div className={className}>
      {props.label && (
        <Label
          className={`${ROOT}__label`}
          text={props.label}
          marked={props.from.required || props.to.required || props.required}
        />
      )}
      <div className={`${ROOT}__controle`}>
        <div className={`${ROOT}__from-time`}>
          {props.from.label && (
            <Label
              className={`${ROOT}__from-label`}
              text={props.from.label}
              marked={props.from.required || props.required}
            />
          )}
          <AttTimeSelect
            className={`${ROOT}__from-input`}
            testId={testId.from}
            disabled={props.from.disabled || props.disabled}
            readOnly={props.from.readOnly || props.readOnly}
            error={hasFromErrors || hasErrors}
            value={props.from.value}
            defaultValue={props.from.defaultValue}
            placeholder={props.from.placeholder || props.placeholder}
            onChange={(value) => {
              const onChangeValue = props.from.onChangeValue;
              if (onChangeValue) {
                onChangeValue(value, parseIntOrNull(props.to.value));
              }
            }}
          />
        </div>
        {props.separator !== null && props.separator !== undefined ? (
          props.separator
        ) : (
          <div className={`${ROOT}__separator-text`}>
            <Icon type="dash" size="x-small" />
          </div>
        )}
        <div className={`${ROOT}__to-time`}>
          {props.to.label && (
            <Label
              className={`${ROOT}__to-label`}
              text={props.to.label}
              marked={props.to.required || props.required}
            />
          )}
          <AttTimeSelect
            className={`${ROOT}__to-input`}
            testId={testId.to}
            disabled={props.to.disabled || props.disabled}
            readOnly={props.to.readOnly || props.readOnly}
            error={hasToErrors || hasErrors}
            value={props.to.value}
            defaultValue={props.to.defaultValue}
            placeholder={props.to.placeholder || props.placeholder}
            onChange={(value) => {
              const onChangeValue = props.to.onChangeValue;
              if (onChangeValue) {
                onChangeValue(parseIntOrNull(props.from.value), value);
              }
            }}
          />
        </div>
        <div className={`${ROOT}__actions`}>
          {(props.actions || []).map((action, idx) => (
            <div key={String(idx)} className={`${ROOT}__actions-item`}>
              {action}
            </div>
          ))}
        </div>
      </div>
      {(hasErrors || hasFromErrors || hasToErrors) && (
        <Errors messages={[...errors, ...fromErrors, ...toErrors]} />
      )}
    </div>
  );
};
