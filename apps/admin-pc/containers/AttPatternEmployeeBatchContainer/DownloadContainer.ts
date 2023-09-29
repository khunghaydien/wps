import { connect } from 'react-redux';

import { BATCH_RESULT_STATUS } from '../../../repositories/attendance/AttPatternEmployeeBatchRepository';

import {
  downloadFile,
  refreshListBatchResult,
} from '../../action-dispatchers/AttPatternEmployeeBatch';

import { State } from '../../reducers';

import Download from '../../presentational-components/AttPatternEmployeeBatch/DetailPane/Download';

export default connect(
  (state: State) => ({
    id: state.attPatternEmployeeBatch.ui.detailPane.id,
    actedAt: state.attPatternEmployeeBatch.ui.detailPane.actedAt,
    actor: state.attPatternEmployeeBatch.ui.detailPane.actor,
    comment: state.attPatternEmployeeBatch.ui.detailPane.comment,
    status: state.attPatternEmployeeBatch.ui.detailPane.status,
    count: state.attPatternEmployeeBatch.ui.detailPane.count,
    successCount: state.attPatternEmployeeBatch.ui.detailPane.successCount,
    failureCount: state.attPatternEmployeeBatch.ui.detailPane.failureCount,
    canDownload:
      state.attPatternEmployeeBatch.ui.detailPane.status ===
      BATCH_RESULT_STATUS.Completed,
    companyId: state.base.menuPane.ui.targetCompanyId,
  }),
  {
    onClickDownload: downloadFile,
    refreshListBatchResult,
  },
  (stateProps, dispatchProps) => ({
    ...stateProps,
    ...dispatchProps,
    onClickDownload: () => dispatchProps.onClickDownload(stateProps.id),
    onClickRefresh: () => {
      dispatchProps.refreshListBatchResult(stateProps.companyId, stateProps.id);
    },
  })
)(Download);
