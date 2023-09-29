import * as React from 'react';

export type Props = Readonly<{
  value: boolean;
  label: string;
  disabled: boolean;
  onChange: (arg0: boolean) => void;
}>;

const CheckboxField = (props: Props) => {
  const { value, label, disabled, onChange } = props;
  return (
    <div>
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
  );
};

export default CheckboxField;
