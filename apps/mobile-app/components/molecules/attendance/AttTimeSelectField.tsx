import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../atoms/Errors';
import Label from '../../atoms/Label';
import AttTimeSelect, { Props as AttTimeSelectProps } from './AttTimeSelect';

const ROOT = 'mobile-app-molecules-attendance-att-time-select-field';

type Props = Readonly<
  AttTimeSelectProps & {
    className?: string;
    emphasis?: boolean;
    errors?: string[];
    required?: boolean;
    label: string;
    testId?: string;
  }
>;

export default (props: Props) => {
  const {
    className,
    emphasis,
    errors: $errors,
    label,
    required,
    testId,
    ...selectProps
  } = props;
  const errors = $errors || [];
  const hasErrors = errors.length > 0;

  return (
    <div className={classNames(ROOT, className)}>
      <Label
        className={`${ROOT}__label`}
        text={label}
        marked={required}
        emphasis={emphasis}
      >
        <AttTimeSelect {...selectProps} error={hasErrors} testId={testId} />
      </Label>
      {hasErrors ? <Errors messages={errors} /> : null}
    </div>
  );
};
