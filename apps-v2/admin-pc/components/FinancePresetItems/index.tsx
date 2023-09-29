import React, { useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';

import IconAdd from '../../../psa-pc/images/icons/add.svg';
import PresetNames from './PresetNames';

import './index.scss';

const ROOT = `admin-pc__finance-preset-items`;
type Props = {
  tmpEditRecord: any;
  editRecord: any;
  onChangeDetailItem: (arg0: string, arg1: Array<string>) => void;
  isDisabled: boolean;
};

const FinancePresetItems = (props: Props) => {
  const tmpNames = props.tmpEditRecord.presetItems; // on the client Side
  const savedNames = props.editRecord.presetItems; // coming from BackEnd

  const savedNameState = tmpNames || savedNames;

  const getInitialPresetItemsFromRecords = () => {
    if (savedNameState) {
      return cloneDeep(savedNameState);
    } else {
      return [''];
    }
  };

  const initialNames: Array<any> = getInitialPresetItemsFromRecords();

  const [presetItems, setPresetItems] = useState(initialNames);

  const [dialogVisibility, setDialogVisibility] = useState(false);

  const openDialog = () => {
    if (presetItems.length === 0) {
      setPresetItems(['']);
    }
    setDialogVisibility(true);
  };
  const closeDialog = () => {
    setDialogVisibility(false);
  };

  const cancelAndCloseDialog = () => {
    if (
      presetItems.length === 1 &&
      presetItems[0] === '' &&
      savedNameState.length === 1 &&
      savedNameState[0] === ''
    ) {
      setPresetItems([]);
    } else setPresetItems(savedNameState);
    closeDialog();
  };

  const addName = () => {
    const updatedState = [...presetItems];
    updatedState.push('');
    setPresetItems(updatedState);
  };

  const removeName = (index) => {
    let updatedState = [...presetItems];
    updatedState.splice(index, 1);
    if (updatedState.length === 0) {
      updatedState = [''];
    }
    setPresetItems(updatedState);
  };

  const updatePresetName = (e, i) => {
    const updatedState = [...presetItems];
    updatedState[i] = e.target.value;
    setPresetItems(updatedState);
  };
  const saveAndCloseDialog = () => {
    let filteredPresetItems = [];
    if (presetItems.length) {
      filteredPresetItems = presetItems.filter((e) => e.length);
    }
    props.onChangeDetailItem('presetItems', filteredPresetItems);
    closeDialog();
  };

  const isAddNameDisabled = presetItems && presetItems.length === 5;

  const dialogFooter = () => {
    return (
      <DialogFrame.Footer>
        <Button
          className={`${ROOT}__add-links--dialog`}
          onClick={addName}
          disabled={isAddNameDisabled}
        >
          <IconAdd
            className={`${ROOT}__add-links-icon${
              isAddNameDisabled && `__disable`
            }`}
          />
          <span className={`${ROOT}__add-links-text`}>
            {msg().Psa_Lbl_Add_Default_Details}
          </span>
        </Button>
        <div className={`${ROOT}__right`}>
          <Button className={`${ROOT}__button`} onClick={cancelAndCloseDialog}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            className={`${ROOT}__button ${ROOT}__add-button`}
            onClick={saveAndCloseDialog}
          >
            {msg().Com_Btn_Save}
          </Button>
        </div>
      </DialogFrame.Footer>
    );
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__btn-container`}>
        <Button
          type="secondary"
          disabled={props.isDisabled}
          className={`${ROOT}__add-names`}
          onClick={openDialog}
        >
          {msg().Psa_Lbl_Add_Default_Details}
        </Button>
      </div>
      {savedNameState && savedNameState.length !== 0 && (
        <div className={`${ROOT}__read-only-names`}>
          {savedNameState.length !== 0 &&
            savedNameState.map((name) => {
              return <PresetNames name={name} readOnly />;
            })}
        </div>
      )}
      {dialogVisibility && (
        <DialogFrame
          className={`${ROOT}__dialog`}
          title={msg().Psa_Lbl_Add_Default_Details}
          hide={closeDialog}
          footer={dialogFooter()}
        >
          {presetItems.length !== 0 &&
            presetItems.map((name, index) => {
              return (
                <PresetNames
                  name={name}
                  updateNameEn={(e) => {
                    updatePresetName(e, index);
                  }}
                  removeLink={() => removeName(index)}
                />
              );
            })}
        </DialogFrame>
      )}
    </div>
  );
};

export default FinancePresetItems;
