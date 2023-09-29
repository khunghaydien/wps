import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';

import './index.scss';

type Props = {
  name: string;
  updateNameEn?: (arg0: any) => void;
  readOnly?: boolean;
  removeLink?: () => void;
};

const ROOT = `admin-pc__finance-preset-items__preset-names`;
const PresetNames = (props: Props) => {
  const textOverFlowClass =
    props.name && props.name.length > 40 && `${ROOT}__preset-item`;
  return (
    <div className={`${ROOT}-container`}>
      <div className={`${ROOT}__container-item`}>
        <div className={`${ROOT}-item`}>
          <span className="link-name-label">{msg().Psa_Lbl_Name}:</span>
          <TextField
            className={textOverFlowClass}
            value={props.name}
            onChange={props.updateNameEn}
            disabled={props.readOnly}
            maxLength={80}
            title={props.name}
          />
        </div>
      </div>
      {!props.readOnly && (
        <div className={`${ROOT}__button-container`}>
          <p className={`${ROOT}__count`}>{`${props.name.length}/80`}</p>
          <Button
            type="destructive"
            className="name-delete-btn"
            onClick={props.removeLink}
          >
            {msg().Com_Btn_Remove}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PresetNames;
