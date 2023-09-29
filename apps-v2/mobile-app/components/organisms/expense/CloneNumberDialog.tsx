import React, { useState } from 'react';

import msg from '@commons/languages';
import Dialog from '@mobile/components/molecules/commons/Dialog';
import SelectField from '@mobile/components/molecules/commons/Fields/SelectField';

import './CloneNumberDialog.scss';

const ROOT = 'mobile-app-organisms-expense-clone-number-dialog';

type Props = {
  isOpen: boolean;
  closeDialog: () => void;
  onClickClone: (cloneNumber: number) => void;
};

const MAX_CLONE_NUMBER = 10;

export const NUMBER_CLONE = 'numberClone';

const buildNumberOption = (): Array<{ label: string; value: number }> =>
  Array.from(Array(MAX_CLONE_NUMBER), (_, idx) => ({
    label: `${idx + 1}`,
    value: idx + 1,
  }));

const CloneNumberDialog = ({ isOpen, closeDialog, onClickClone }: Props) => {
  const [cloneNumber, setCloneNumber] = useState(1);

  const handleNumberSelection = (
    e: React.SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    setCloneNumber(Number(e.currentTarget.value));
  };

  const handleClone = () => {
    onClickClone(cloneNumber);
  };

  const renderContent = () => (
    <div className={`${ROOT}__contents`}>
      <div className={`${ROOT}-clone-indicator`}>
        {msg().Exp_Msg_CloneRecordMobileNumber}
      </div>
      <SelectField
        options={buildNumberOption()}
        onChange={handleNumberSelection}
        value={cloneNumber}
        label={''}
      />
    </div>
  );

  return (
    <div className={ROOT}>
      {isOpen && (
        <Dialog
          title={msg().Exp_Lbl_CloneMultiple}
          content={renderContent()}
          leftButtonLabel={msg().Com_Btn_Cancel}
          rightButtonLabel={msg().Exp_Lbl_Clone}
          onClickCloseButton={closeDialog}
          onClickLeftButton={closeDialog}
          onClickRightButton={handleClone}
        />
      )}
    </div>
  );
};

export default CloneNumberDialog;
