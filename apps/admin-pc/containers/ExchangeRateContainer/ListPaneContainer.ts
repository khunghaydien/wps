import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { actions as exchangeRateUIActions } from '../../modules/exchangeRate/ui/editingExchangeRate';

import ListPane from '../../presentational-components/ExchangeRate/ListPane';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  companyList: state.searchCompany,
  exchangeRateList: state.exchangeRate.entities.exchangeRateList,
  selectedRecordId: state.exchangeRate.ui.editingExchangeRate.selectedId,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      selectExhangeRate: exchangeRateUIActions.select,
      onClickCreateNewButton: (company) =>
        exchangeRateUIActions.startEditingNew(
          company.id,
          company.currencyField.code,
          company.currencyField.name
        ),
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onSelectExchangeRate: (rec) => {
    const selectedItem = _.find(stateProps.exchangeRateList, { id: rec.id });
    dispatchProps.selectExhangeRate(selectedItem);
  },
  onClickCreateNewButton: () => {
    const company = _.filter(stateProps.companyList, {
      id: stateProps.companyId,
    })[0];
    dispatchProps.onClickCreateNewButton(company);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ListPane);
