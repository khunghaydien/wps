import { connect } from 'react-redux';

import {
  listImportResults,
  openDownloadDetailPane,
  openNewDetailPane,
} from '../../action-dispatchers/time-record-item-import';

import { State } from '../../reducers';

import TimeRecordItemImport from '../../presentational-components/TimeRecordItemImport';

export default connect(
  (state: State, ownProps) => ({
    ...ownProps,
    items: state.timeRecordItemImport.entites.importResultList,
    companyId: state.base.menuPane.ui.targetCompanyId,
  }),
  {
    onClickCreate: openNewDetailPane,
    onClickEdit: openDownloadDetailPane,
    listImportResults,
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    initialize: (companyId: string, showLoading = true) => {
      dispatchProps.listImportResults(companyId, showLoading);
    },
  })
)(TimeRecordItemImport) as React.ComponentType<Record<string, any>>;
