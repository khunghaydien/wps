import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NAMESPACE_PREFIX } from '@apps/commons/api';
import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';

import { State } from '@psa/modules';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';
import { hideDialog } from '@psa/action-dispatchers/PSA';

// --- Job Selection --- //
import './index.scss';

const ROOT = 'ts-psa__generate-link';

// @ts-ignore

const GenerateProjectLinkDialog = () => {
  const dispatch: AppDispatch = useDispatch();

  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [link, setLink] = useState({
    permission: 'Read',
    value:
      window.location.hostname +
      `/lightning/n/${NAMESPACE_PREFIX}DetailPage?c__projectId=${selectedProject.projectId}&c__page=${NAMESPACE_PREFIX}Projects`,
  });

  return (
    <DialogFrame
      title={msg().Psa_Lbl_GenerateLink}
      hide={() => {}}
      withoutCloseButton
      className={`${ROOT}__dialog-frame`}
      draggable
      footer={
        <DialogFrame.Footer>
          <Button
            type="default"
            onClick={() => dispatch(hideDialog())}
            data-testid={`${ROOT}__btn--cancel`}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT} `}>
        {/* <FormField
          title={msg().Psa_Lbl_GenerateLinkPermission}
          testId={`${ROOT}__permission`}
          // tooltip={props.customHint.status}
        >
          <SelectField
            onChange={(e) => {
              onSetLink(e.target.value);
            }}
            options={permissionOptions}
            value={link.permission}
          />
        </FormField> */}
        <FormField
          title={msg().Psa_Lbl_GeneratedLink}
          testId={`${ROOT}__Link`}
          className={`${ROOT}__GeneratedLinkField`}
        >
          <TextAreaField
            className={`${ROOT}__copyText`}
            disabled={true}
            value={link.value}
          />
        </FormField>
      </div>
    </DialogFrame>
  );
};

export default GenerateProjectLinkDialog;
