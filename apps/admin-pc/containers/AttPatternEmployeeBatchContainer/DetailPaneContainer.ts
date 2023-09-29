import { connect } from 'react-redux';

import * as baseActions from '../../modules/base/detail-pane/ui';

import { State } from '../../reducers';

import DetailPane from '../../presentational-components/AttPatternEmployeeBatch/DetailPane';

export default connect(
  (state: State, ownProps) => ({
    ...ownProps,
    isNew: state.attPatternEmployeeBatch.ui.detailPane.isNew,
  }),
  {
    onClickClose: () => baseActions.showDetailPane(false),
  }
)(DetailPane) as React.ComponentType<Record<string, any>>;
