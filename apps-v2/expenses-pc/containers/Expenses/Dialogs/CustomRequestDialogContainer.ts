import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import set from 'lodash/set';

import CustomRequest, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/CustomRequest';

import { State } from '../../../modules';

import {
  getCustomRequestTypes,
  searchCustomRequests,
  searchEmployees,
} from '../../../action-dispatchers/Expenses';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const MAX_SEARCH_RESULT = 100;

const mapStateToProps = (state: State) => ({
  companyId: state.userSetting.companyId,
  accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
});

const mapDispatchToProps = {
  searchCustomRequests,
  searchEmployees,
  getCustomRequestTypes,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  MAX_SEARCH_RESULT,
  // @ts-ignore
  getCustomRequestTypes: () => dispatchProps.getCustomRequestTypes(),
  searchEmployeeOptions: (
    targetDate?: string,
    searchString?: string,
    loadInBackground?: boolean
  ) => {
    return (
      dispatchProps
        .searchEmployees(
          stateProps.companyId,
          targetDate,
          MAX_SEARCH_RESULT + 1,
          searchString,
          loadInBackground
        )
        // @ts-ignore
        .then((employees) => {
          const options = employees.map((employee) => ({
            label: employee.name,
            value: employee.id,
          }));
          return options;
        })
    );
  },

  onClickCustomRequest: (customRequest) => {
    const expReport = cloneDeep(ownProps.expReport);
    const touched = cloneDeep(ownProps.touched);
    const { title, id } = customRequest;
    expReport.customRequestId = id;
    expReport.customRequestName = title;
    set(touched, 'report.customRequestId', true);
    ownProps.onChangeEditingExpReport('report', expReport, touched);
    ownProps.onClickHideDialogButton();
  },

  selectedAccountingPeriod: (() => {
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });
    return selectedAccountingPeriod;
  })(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CustomRequest) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
