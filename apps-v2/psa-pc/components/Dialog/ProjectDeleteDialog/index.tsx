import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextField from '@apps/commons/components/fields/TextField';
import iconConfirm from '@apps/commons/images/iconConfirm.png';
import msg from '@apps/commons/languages';

import { State } from '@psa/modules';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';
import { deleteProject } from '@psa/action-dispatchers/Project';
import { hideDialog } from '@psa/action-dispatchers/PSA';

import './index.scss';

// --- Job Selection --- //

const ROOT = 'ts-psa__delete-project-dialog-componenet';
const DeleteProjectDialog = () => {
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const dispatch: AppDispatch = useDispatch();
  const [textFieldEquality, setTextFieldQuality] = useState({
    fieldValue: '',
    fieldEquality: false,
  });

  const updateTextFieldQualityObject = (value: string) => {
    setTextFieldQuality({
      fieldValue: value,
      fieldEquality: value === selectedProject.name,
    });
  };

  const onClickOk = () => {
    const { projectId } = selectedProject;
    dispatch(deleteProject(projectId));
  };
  const onClickCancel = () => {
    dispatch(hideDialog());
  };
  return (
    <DialogFrame
      createProject={false}
      title={msg().Psa_Btn_DeleteProject}
      hide={() => {}}
      withoutCloseButton
      className={`${ROOT}__dialog-frame`}
      draggable
      footer={
        <DialogFrame.Footer>
          <Button
            type="default"
            onClick={onClickCancel}
            data-testid={`${ROOT}__btn--cancel`}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
          <Button
            disabled={!textFieldEquality.fieldEquality}
            type="primary"
            onClick={onClickOk}
            data-testid={`${ROOT}__btn--save`}
          >
            {msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__vFlexWrapper`}>
        <div className={`${ROOT}__FlexChild`}>
          <div className={`${ROOT}__message`}>
            <div className={`${ROOT}__icon`}>
              <img src={iconConfirm} alt="INFO" />
            </div>
            <div
              data-testid={`${ROOT}__content`}
              className={`${ROOT}__content`}
            >
              {msg().Psa_Lbl_DeleteProject}
              <br></br>
              {msg().Psa_Lbl_DeleteProject_FirstPart_Content}
              <span className={`${ROOT}__projectName_Delete`}>
                {selectedProject.name}
              </span>
              {` ${msg().Psa_Lbl_DeleteProject_SecondPart_Content}`}
            </div>
          </div>
        </div>

        <div className={`${ROOT}__Input`}>
          <TextField
            value={textFieldEquality.fieldValue}
            onChange={(e) => updateTextFieldQualityObject(e.target.value)}
          />
        </div>
      </div>
    </DialogFrame>
  );
};

export default DeleteProjectDialog;
