import React, { useState } from 'react';

import IconButton from '../../../commons/components/buttons/IconButton';
import TextField from '../../../commons/components/fields/TextField';
import btnSearch from '../../../commons/images/btnSearchVia.png';
import msg from '../../../commons/languages';

import './index.scss';

const ROOT = 'admin-pc-search-area';

type SearchField =
  | 'code'
  | 'name'
  | 'userName'
  | 'departmentCode'
  | 'departmentName'
  | 'title';

type Props = {
  fields: string[] | SearchField;
  onClickSearchBtn: (arg0: {
    code: string;
    name: string;
    userName: string;
    departmentCode: string;
    departmentName: string;
    title: string;
  }) => void;
};

const SearchArea = (props: Props) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [title, setTitle] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      props.onClickSearchBtn({
        code,
        name,
        userName,
        departmentCode,
        departmentName,
        title,
      });
    }
  };

  const renderField = (value: string, setter: Function, label: string) => {
    return (
      <div className={`${ROOT}__control`}>
        <div className={`${ROOT}__label`}>{label}</div>
        <div className={`${ROOT}__input`}>
          <TextField
            onChange={(_e, val: string) => setter(val)}
            onKeyDown={handleKeyDown}
            value={value}
            autoFocus
            placeholder={msg().Admin_Lbl_Search}
          />
        </div>
      </div>
    );
  };

  const showField = (field: string) => props.fields.includes(field);

  const codeInput =
    showField('code') && renderField(code, setCode, msg().Admin_Lbl_Code);

  const nameInput =
    showField('name') && renderField(name, setName, msg().Admin_Lbl_Name);

  const userNameInput =
    showField('userName') &&
    renderField(userName, setUserName, msg().Admin_Lbl_UserName);

  const departmentCodeInput =
    showField('departmentCode') &&
    renderField(
      departmentCode,
      setDepartmentCode,
      msg().Admin_Lbl_DepartmentCode
    );

  const departmentNameInput =
    showField('departmentName') &&
    renderField(
      departmentName,
      setDepartmentName,
      msg().Admin_Lbl_DepartmentName
    );

  const titleInput =
    showField('title') &&
    renderField(title, setTitle, msg().Admin_Lbl_Position);

  return (
    <div className={ROOT}>
      {codeInput}
      {nameInput}
      {userNameInput}
      {departmentCodeInput}
      {departmentNameInput}
      {titleInput}
      <IconButton
        src={btnSearch}
        className={`${ROOT}__search-button`}
        onClick={() =>
          props.onClickSearchBtn({
            code,
            name,
            userName,
            departmentCode,
            departmentName,
            title,
          })
        }
      />
    </div>
  );
};

export default SearchArea;
