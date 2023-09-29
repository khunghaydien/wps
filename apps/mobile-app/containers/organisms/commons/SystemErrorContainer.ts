import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import mapValues from 'lodash/mapValues';
import { $Diff } from 'utility-types';

import AppPermissionUtil from '../../../../commons/utils/AppPermissionUtil';
import Component, {
  Props,
} from '../../../components/organisms/commons/SystemError';
import { errorExists, reset } from '../../../modules/commons/error';
import { AppDispatch } from '@apps/commons/modules/AppThunk';

import { State } from '../../../modules';

type Action = { resetError: () => void };

const mapStateToProps = (state: State, _ownProps): $Diff<Props, Action> => {
  const { useExpense, employeeId, currencyId } = state.userSetting;
  const hasPermissionError = AppPermissionUtil.checkPermissionError(
    useExpense,
    employeeId,
    currencyId,
    true
  );
  return {
    continue: state.mobileCommons.error.isContinuable,
    message: state.mobileCommons.error.message,
    solution: undefined, // TODO Display solution for error.
    showError: errorExists(state.mobileCommons.error) || !!hasPermissionError,
    hasPermissionError,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch): Action => ({
  ...mapValues(
    bindActionCreators(
      {
        resetError: reset,
      },
      dispatch
    ),
    (action) => () => {
      action();
    }
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
