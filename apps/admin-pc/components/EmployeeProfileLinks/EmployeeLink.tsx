import React from 'react';

import get from 'lodash/get';

import Button from '../../../commons/components/buttons/Button';
import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';

type LinkProps = {
  name: string;
  url: string;
};

export type LinkStateProps = LinkProps & {
  errors?: LinkProps | null;
};

type Props = {
  updateName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateUrl?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeLink?: (index: number) => void;
  readOnly?: boolean;
  linkState: LinkStateProps;
};
const EmployeeLink = (props: Props) => {
  const nameError = get(props.linkState, 'errors.name', '');
  const urlError = get(props.linkState, 'errors.url', '');
  const nameErrorClass = nameError && 'has-error';
  const urlErrorClass = urlError && 'has-error';

  return (
    <div className="link-container">
      <div className="link-name">
        <span className="link-name-label">{msg().Admin_Lbl_Name}:</span>
        <TextField
          className={`link-input ${nameErrorClass}`}
          value={props.linkState.name}
          onChange={props.updateName}
          disabled={props.readOnly}
        />
        {nameError && <p className="error-msg">{nameError}</p>}
      </div>
      <div className="link-url">
        <span className="link-url-label">{msg().Admin_Lbl_LinkUrl}:</span>
        <TextField
          className={`link-input ${urlErrorClass}`}
          value={props.linkState.url}
          onChange={props.updateUrl}
          disabled={props.readOnly}
          placeholder={`https://example.com/`}
        />
        {urlError && <p className="error-msg">{urlError}</p>}
      </div>
      {!props.readOnly && (
        <Button
          type="destructive"
          className="link-delete-btn"
          onClick={props.removeLink}
        >
          {msg().Com_Btn_Remove}
        </Button>
      )}
    </div>
  );
};

export default EmployeeLink;
