// @ts-nocheck
import { connect } from 'react-redux';

import { actions as detailPaneActions } from '../../modules/timeRecordItemImport/ui/detailPane';

import {
  deleteFile,
  dropFile,
  executeImport,
} from '../../action-dispatchers/time-record-item-import';

import { State } from '../../reducers';

import New from '../../presentational-components/TimeRecordItemImport/DetailPane/New';

export default connect(
  (state: State) => ({
    files: state.timeRecordItemImport.ui.detailPane.files,
    canExecute:
      state.timeRecordItemImport.ui.detailPane.files &&
      state.timeRecordItemImport.ui.detailPane.files.length > 0 &&
      state.timeRecordItemImport.ui.timeRecordItemImportList.isValid,
    companyId: state.base.menuPane.ui.targetCompanyId,
    records: state.timeRecordItemImport.ui.timeRecordItemImportList.list,
  }),
  {
    onChange: detailPaneActions.update,
    onDropAccepted: (files) => dropFile(files[0]),
    onClickDelete: (_e) => deleteFile(),
    executeImport,
  },
  (stateProps, dispatchProps) => ({
    ...stateProps,
    ...dispatchProps,
    onClickExecute: () => {
      dispatchProps.executeImport(stateProps.companyId, stateProps.records);
    },
  })
)(New) as React.ComponentType<Record<string, any>>;
