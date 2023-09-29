import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';
import * as creditCard from '@apps/admin-pc/actions/creditCard';

import CreditCard from '@apps/admin-pc/presentational-components/CreditCard';

const mapStateToProps = (state) => ({
  searchCreditCard: state.searchCreditCard,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: creditCard.searchCreditCard,
      create: creditCard.createCreditCard,
      update: creditCard.updateCreditCard,
      delete: creditCard.deleteCreditCard,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditCard as any) as React.ComponentType<Record<string, any>>;
