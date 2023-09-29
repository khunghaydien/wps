import { connect } from 'react-redux';

import {
  listBatchResults,
  openDownloadDetailPane,
  openNewDetailPane,
} from '../../action-dispatchers/AttPatternEmployeeBatch';

import { State } from '../../reducers';

import AttPatternEmployeeBatch from '../../presentational-components/AttPatternEmployeeBatch';

export default connect(
  (state: State, ownProps) => ({
    ...ownProps,
    items: state.attPatternEmployeeBatch.entites.batchResultList,
    companyId: state.base.menuPane.ui.targetCompanyId,
  }),
  {
    onClickCreate: openNewDetailPane,
    onClickEdit: openDownloadDetailPane,
    listBatchResults,
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    initialize: (companyId: string, showLoading = true) => {
      dispatchProps.listBatchResults(companyId, showLoading);
    },
  })
)(AttPatternEmployeeBatch) as React.ComponentType<Record<string, any>>;
