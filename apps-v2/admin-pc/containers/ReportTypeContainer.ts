import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import {
  cleanSelectedExpense,
  setSelectedExp,
} from '../modules/expTypeLinkConfig/ui';

import { searchMinimalExpenseTypes as searchExpenseType } from '../actions/expenseType';
import { searchExtendedItem } from '../actions/extendedItem';
import * as reportType from '../actions/reportType';
import { search as searchPaymentMethod } from '@admin-pc-v2/actions/paymentMethod';
import { searchPrintPageLayout } from '@apps/admin-pc-v2/actions/printPageLayout';

import ReportType from '../presentational-components/ReportType';

const mapStateToProps = (state) => ({
  searchReportType: state.searchReportType,
  searchExtendedItem: state.searchExtendedItem,
  value2msgkey: state.value2msgkey,
});

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: reportType.createReportType,
    update: reportType.updateReportType,
    delete: reportType.deleteReportType,
    search: reportType.searchReportType,
    searchById: reportType.searchReportTypeById,
    searchPaymentMethod,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, reportType, {
        searchExtendedItem,
        searchExpenseType,
        cleanSelectedExpense,
        setSelectedExp,
        searchPrintPageLayout,
      }),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportType);
