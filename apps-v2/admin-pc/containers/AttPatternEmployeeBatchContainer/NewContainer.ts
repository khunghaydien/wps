// @ts-nocheck
import { connect } from 'react-redux';

import { actions as detailPaneActions } from '../../modules/attPatternEmployeeBatch/ui/detailPane';

import {
  deleteFiles,
  dropAttPatternEmployeeBatchFiles,
  executeBatch,
} from '../../action-dispatchers/AttPatternEmployeeBatch';

import { State } from '../../reducers';

import New from '../../presentational-components/AttPatternEmployeeBatch/DetailPane/New';

export default connect(
  (state: State) => ({
    comment: state.attPatternEmployeeBatch.ui.detailPane.comment,
    files: state.attPatternEmployeeBatch.ui.detailPane.files,
    canExecute:
      state.attPatternEmployeeBatch.ui.detailPane.files &&
      state.attPatternEmployeeBatch.ui.detailPane.files.length > 0 &&
      state.attPatternEmployeeBatch.entites.employeePatternList.isValid,
    companyId: state.base.menuPane.ui.targetCompanyId,
    records: state.attPatternEmployeeBatch.entites.employeePatternList.list,
  }),
  {
    onChange: detailPaneActions.update,
    onDropAccepted: (files) => dropAttPatternEmployeeBatchFiles(files[0]),
    onClickDelete: (_e) => deleteFiles(),
    executeBatch,
  },
  (stateProps, dispatchProps) => ({
    ...stateProps,
    ...dispatchProps,
    onClickExecute: () => {
      dispatchProps.executeBatch(
        stateProps.companyId,
        stateProps.comment,
        stateProps.records
      );
    },
  })
)(New) as React.ComponentType<Record<string, any>>;
