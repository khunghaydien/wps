import React, { useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { State } from '../../../../reducers';

import WorkingTypeDialog from '@admin-pc-v2/presentational-components/Employee/WorkingType/Dialog';

import ContentContainer from './ContentContainer';

export type Props = {
  targetDate: string;
  companyId: string;
  onClose: () => void;
  onSubmitDialog: (workingType) => void;
};

const WorkingTypeActionsDialogContainer: React.FC<Props> = ({
  targetDate,
  companyId,
  onClose,
  onSubmitDialog,
}) => {
  const selectedWorkingType = useSelector(
    (state: State) => state.employee.ui.workingTypeDialog.workingType,
    shallowEqual
  );
  const onClickSaveButton = useCallback(() => {
    onSubmitDialog(selectedWorkingType);
    onClose();
  }, [onSubmitDialog, selectedWorkingType, onClose]);

  return (
    <WorkingTypeDialog
      targetDate={targetDate}
      companyId={companyId}
      onClose={onClose}
      onClickSaveButton={onClickSaveButton}
      ContentContainer={ContentContainer}
    />
  );
};

export default WorkingTypeActionsDialogContainer;
