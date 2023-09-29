import { connect } from 'react-redux';

import { IMPORT_RESULT_STATUS } from '@apps/repositories/time-tracking/TimeRecordItemImportRepository';

import {
  downloadFile,
  refresh,
} from '../../action-dispatchers/time-record-item-import';

import { State } from '../../reducers';

import Download from '../../presentational-components/TimeRecordItemImport/DetailPane/Download';

type ImportResultDetail = State['timeRecordItemImport']['ui']['detailPane'];

const canDownload = (detail: ImportResultDetail) =>
  detail.status === IMPORT_RESULT_STATUS.Completed ||
  detail.status === IMPORT_RESULT_STATUS.Failed;

export default connect(
  (state: State) => ({
    id: state.timeRecordItemImport.ui.detailPane.id,
    actedAt: state.timeRecordItemImport.ui.detailPane.actedAt,
    actor: state.timeRecordItemImport.ui.detailPane.actor,
    status: state.timeRecordItemImport.ui.detailPane.status,
    count: state.timeRecordItemImport.ui.detailPane.count,
    successCount: state.timeRecordItemImport.ui.detailPane.successCount,
    failureCount: state.timeRecordItemImport.ui.detailPane.failureCount,
    canDownload: canDownload(state.timeRecordItemImport.ui.detailPane),
    companyId: state.base.menuPane.ui.targetCompanyId,
  }),
  {
    onClickDownload: downloadFile,
    onClickRefresh: refresh,
  },
  (stateProps, dispatchProps) => ({
    ...stateProps,
    ...dispatchProps,
    onClickDownload: () => dispatchProps.onClickDownload(stateProps.id),
    onClickRefresh: () =>
      dispatchProps.onClickRefresh(stateProps.companyId, stateProps.id),
  })
)(Download);
