import React from 'react';

import classNames from 'classnames';

import '../../commons/styles/wsp.scss';
import TextField from '../../commons/components/fields/TextField';
import Form from '../../commons/components/Form';
import IconSearch from '../../commons/images/icons/search.svg';
import msg from '../../commons/languages';

import './ListSearchForm.scss';

const ROOT = 'admin-pc-list-search-form';

const Cell = ({
  label,
  value,
  width,
  onChange,
}: {
  label: string;
  value: string;
  width?: string;
  onChange: (arg0: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className={`${ROOT}__cell`} style={{ flexBasis: width || 'auto' }}>
    <div className={`${ROOT}__label`}>{label}</div>
    <div className={`${ROOT}__text-field-container`}>
      <TextField
        className={`${ROOT}__text-field`}
        value={value}
        onChange={onChange}
        placeholder={msg().Com_Lbl_Search}
      />
    </div>
  </div>
);

export type Props = Readonly<{
  className?: string;
  fields: {
    key: string;
    label: string;
    value: string;
    width?: string;
  }[];
  onChange: (arg0: string, arg1: string | boolean) => void;
  onSubmit: () => void;
}>;

const ListSearchForm = ({ className, fields, onChange, onSubmit }: Props) => (
  <Form className={classNames(ROOT, className)} onSubmit={onSubmit}>
    <div className={`${ROOT}__table`}>
      {fields.map((field) => (
        <Cell
          {...field}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(field.key, event.target.value)
          }
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

export default ListSearchForm;
