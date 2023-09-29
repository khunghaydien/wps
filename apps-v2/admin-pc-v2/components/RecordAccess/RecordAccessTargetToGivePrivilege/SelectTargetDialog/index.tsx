import React, { useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import Label from '@apps/commons/components/fields/Label';
import Select from '@apps/admin-pc/components/MainContents/DetailPane/SingleSelect';
import HorizontalLayout from '@apps/commons/components/fields/layouts/HorizontalLayout';

import msg from '@commons/languages';

import { TARGET } from '@apps/admin-pc-v2/constants/configList/recordAccessPrivilege';

import './SelectTargetDialog.scss';

const ROOT = 'ts-select-target__dialog';
type Props = {
  target: TARGET;
  onCloseDialog: () => void;
  onSelectTargetDialog: (target: TARGET) => void;
};

const SelectTargetDialog = (props: Props) => {
  const { onCloseDialog, target, onSelectTargetDialog } = props;
  const [selectedTarget, setSelectedTarget] = useState(TARGET.Department);

  const onSelectTargets = () => onSelectTargetDialog(selectedTarget);

  const targetOptions = [
    { text: msg().Admin_Lbl_Employee, value: TARGET.Employee },
  ];
  if (target === TARGET.Department)
    targetOptions.unshift({
      text: msg().Admin_Lbl_Department,
      value: TARGET.Department,
    });
  return (
    <DialogFrame
      title={msg().Admin_Lbl_AddTargetToGivePrivilege}
      hide={onCloseDialog}
      className={`${ROOT}-frame`}
      contentsClass={`${ROOT}-frame-contents`}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onCloseDialog}>
            {msg().Com_Btn_Cancel}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}-body`}>
        <Label text={msg().Exp_Lbl_Target}>
          <Select
            // @ts-ignore
            onChange={setSelectedTarget}
            // @ts-ignore
            options={targetOptions}
            value={selectedTarget}
            required
          />
        </Label>
        <HorizontalLayout>
          <HorizontalLayout.Body cols={3} />
          <HorizontalLayout.Body cols={3}>
            <Button
              type="default"
              onClick={onSelectTargets}
              className={`${ROOT}-body-select-button`}
            >
              {msg().Com_Lbl_Select}
            </Button>
          </HorizontalLayout.Body>
        </HorizontalLayout>
      </div>
    </DialogFrame>
  );
};

export default SelectTargetDialog;
