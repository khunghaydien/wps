import { connect } from 'react-redux';

import _ from 'lodash';

import { actions as exchangeRateListEntityActions } from '../../modules/exchangeRate/entities/exchangeRateList';

import { searchCurrency } from '../../actions/currency';
import { getCurrencyPair } from '../../actions/exchangeRate';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import ExchangeRate, {
  Props,
} from '../../presentational-components/ExchangeRate';

const mapStateToProps = (state) => ({
  companyList: state.searchCompany,
  companyId: state.base.menuPane.ui.targetCompanyId,
  isDetailVisible: state.base.detailPane.ui.isShowDetail,
});

const mapDispatchToProps = (dispatch) => ({
  onInitialize: (company) => {
    dispatch(exchangeRateListEntityActions.clear());
    dispatch(
      exchangeRateListEntityActions.fetch(
        company.id,
        company.currencyField.code,
        company.currencyField.name
      )
    );
    dispatch(searchCurrency({ companyId: company.id }));
  },
  getCurrencyPair: () => dispatch(getCurrencyPair()),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onInitialize: () => {
    const company = _.filter(stateProps.companyList, {
      id: stateProps.companyId,
    })[0];
    dispatchProps.onInitialize(company);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExchangeRate) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
