import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as accountingPeriod from '../actions/accountingPeriod';

import AccountingPeriod from '../presentational-components/AccountingPeriod/index';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchAccountingPeriod: state.searchAccountingPeriod,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: accountingPeriod.createAccountingPeriod,
    update: accountingPeriod.updateAccountingPeriod,
    delete: accountingPeriod.deleteAccountingPeriod,
    search: accountingPeriod.searchAccountingPeriod,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, accountingPeriod, {}), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountingPeriod);
