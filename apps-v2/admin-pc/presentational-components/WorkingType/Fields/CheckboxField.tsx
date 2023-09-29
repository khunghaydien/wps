import * as React from 'react';

const ROOT = 'admin-pc-working-type-fields-checkbox-field';

export type Props = Readonly<{
  value: boolean;
  label: string;
  disabled: boolean;
  onChange: (arg0: boolean) => void;
  render: (arg0: Props) => React.ReactNode;
}>;

const CheckboxField = (props: Props) => {
  const { value, label, disabled, onChange, render } = props;
  return (
    <div className={`${ROOT}__body`}>
      <div className={`${ROOT}__checkbox`}>
        <label>
          <input
            type="checkbox"
            disabled={disabled}
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
              onChange(event.currentTarget.checked)
            }
            checked={value}
          />
          <span className="admin-pc-contents-detail-pane__body__item-list__item__checkbox-message">
            {label}
          </span>
        </label>
      </div>
      {render(props)}
    </div>
  );
};

export default CheckboxField;
