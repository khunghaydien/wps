import React from 'react';

import classNames from 'classnames';

import '../../commons/styles/wsp.scss';
import DateField from '../../commons/components/fields/DateField';
import TextField from '../../commons/components/fields/TextField';
import Form from '../../commons/components/Form';
import IconSearch from '../../commons/images/icons/search.svg';
import msg from '../../commons/languages';
import { Dropdown } from '@apps/core';

import './ListSearchFormWithType.scss';

const ROOT = 'admin-pc-list-search-form-with-type';

export const FIELD_TYPE = {
  TEXT: 'text',
  DROPDOWN: 'dropdown',
  DATE: 'date',
} as const;

type FieldType = Value<typeof FIELD_TYPE>;

const Cell = ({
  label,
  value,
  fieldType,
  options,
  disabled,
  width,
  onChange,
}: {
  label: string;
  value: string;
  fieldType: FieldType;
  options?: any[];
  disabled: boolean;
  width?: string;
  onChange: (arg0: string | boolean) => void;
}) => (
  <div className={`${ROOT}__cell`} style={{ flexBasis: width || 'auto' }}>
    <div className={`${ROOT}__label`}>{label}</div>
    <div className={`${ROOT}__text-field-container`}>
      {fieldType === FIELD_TYPE.TEXT && (
        <TextField
          className={`${ROOT}__text-field`}
          disabled={disabled}
          value={value || undefined}
          onChange={(e) => onChange(e.target.value)}
          placeholder={msg().Com_Lbl_Search}
        />
      )}
      {fieldType === FIELD_TYPE.DROPDOWN && (
        <Dropdown
          className={`${ROOT}__text-field`}
          disabled={disabled}
          value={value}
          options={options}
          onSelect={(e) => onChange(e.value)}
          placeholder={msg().Com_Lbl_Search}
        />
      )}
      {fieldType === FIELD_TYPE.DATE && (
        <DateField
          className={`${ROOT}__text-field`}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  </div>
);

export type Props = Readonly<{
  className?: string;
  fields: {
    key: string;
    label: string;
    value: string;
    fieldType: FieldType;
    options?: any[];
    width?: string;
  }[];
  disabledFields?: string[];
  onChange: (arg0: string, arg1: string | boolean) => void;
  onSubmit: () => void;
}>;

const ListSearchFormWithType = ({
  className,
  fields,
  disabledFields,
  onChange,
  onSubmit,
}: Props) => (
  <Form className={classNames(ROOT, className)} onSubmit={onSubmit}>
    <div className={`${ROOT}__table`}>
      {fields.map((field) => (
        <Cell
          key={field.key}
          disabled={disabledFields?.includes(field.key) || false}
          {...field}
          onChange={(value) => onChange(field.key, value)}
        />
      ))}
    </div>
    <div className={`${ROOT}__action-button-container`}>
      <button
        type="submit"
        className={classNames('wsp-button--primary', `${ROOT}__search-button`)}
      >
        <IconSearch className={`${ROOT}__search-button-svg`} />
      </button>
    </div>
  </Form>
);

export default ListSearchFormWithType;
