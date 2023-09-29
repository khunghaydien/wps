import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WorkSystemType } from '@attendance/domain/models/WorkingType';

import PatternActions from '../../../../action-dispatchers/working-type/pattern';

import { State } from '../../../../reducers';

import PatternDialog from '@apps/admin-pc/presentational-components/WorkingType/Fields/AttPattern/PatternDialog';

import ContentContainer from './ContentContainer';

export type Props = {
  isOpen: boolean;
  workSystem: WorkSystemType;
  onClose: () => void;
};

const PatternDialogContainer: React.FC<Props> = ({
  isOpen,
  workSystem,
  onClose,
}) => {
  const dispatch = useDispatch();
  const patternActions = PatternActions(dispatch);

  const selectedPatterns = useSelector(
    (state: State) => state.workingType.ui.pattern.selectedTable.selectedTable
  );

  const close = useCallback(() => {
    patternActions.resetDialog();
    onClose();
  }, [onClose, patternActions]);

  const onClickSaveButton = useCallback(() => {
    patternActions.savePattern(selectedPatterns);
    close();
  }, [close, patternActions, selectedPatterns]);

  return (
    <PatternDialog
      isOpen={isOpen}
      workSystem={workSystem}
      onClose={close}
      onClickSaveButton={onClickSaveButton}
      ContentContainer={ContentContainer}
    />
  );
};

export default PatternDialogContainer;
