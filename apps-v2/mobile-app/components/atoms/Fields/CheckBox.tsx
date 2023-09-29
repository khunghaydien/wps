import * as React from 'react';

import classNames from 'classnames';

// NOTE 通常はatoms -> atomsへの依存はよくないのだけど、Iconに限り例外的にそうしている
import Icon from '../Icon';

import './CheckBox.scss';

const ROOT = 'mobile-app-atoms-checkbox';

type Props = Readonly<
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'checked'
  > & {
    className?: string;
    error?: boolean;
    testId?: string;
    id?: string;
    label?: string;
    value?: boolean;
  }
>;

const createClassNames = (prefix: string, props: Props) => ({
  [`${prefix}--checked`]: props.value,
  [`${prefix}--error`]: props.error,
  [`${prefix}--disabled`]: props.disabled,
  [`${prefix}--read-only`]: props.readOnly,
});

const CheckBox: React.FC<Props> = ({
  className: $className,
  testId,
  id,
  label: $label,
  value,
  ...props
}) => {
  const status = React.useMemo(
    () => ({
      value,
      error: props.error,
      disabled: props.disabled,
      readOnly: props.readOnly,
    }),
    [value, props.error, props.disabled, props.readOnly]
  );
  const className = React.useMemo(
    () => classNames(ROOT, $className, createClassNames(ROOT, status)),
    [$className, status]
  );
  const checkboxClassName = React.useMemo(
    () =>
      classNames(
        `${ROOT}__input-checkbox`,
        createClassNames(`${ROOT}__input-checkbox`, status)
      ),
    [status]
  );

  return (
    <div className={className}>
      <label className={`${ROOT}__container`} htmlFor={id}>
        <input
          key="input"
          {...props}
          className={`${ROOT}__input`}
          id={id}
          type="checkbox"
          checked={value}
          data-test-id={testId}
          aria-invalid={props.error}
        />
        <span key="icon" className={checkboxClassName}>
          <Icon type="check-copy" size="medium" />
        </span>
        {$label ? (
          <div key="label" className={`${ROOT}__label`}>
            {$label}
          </div>
        ) : null}
      </label>
    </div>
  );
};

export default CheckBox;
