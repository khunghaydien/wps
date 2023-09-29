import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as financeCategoryActions from '../actions/financeCategory';
import * as psaSettingActions from '../actions/psaSetting';

import FinanceCategory from '../presentational-components/FinanceCategory';

const mapStateToProps = (state) => ({
  itemList: state.searchFinanceCategory,
  value2msgkey: state.value2msgkey,
  searchPsaSetting: state.searchPsaSetting,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: financeCategoryActions.searchCategory,
      create: financeCategoryActions.createCategory,
      update: financeCategoryActions.updateCategory,
      delete: financeCategoryActions.deleteCategory,
      getConstants: financeCategoryActions.getConstantsFinanceType,
      getPsaSettings: psaSettingActions.getPsaSetting,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceCategory) as React.ComponentType<Record<string, any>>;
