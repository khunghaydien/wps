import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import { fetchCurrencyCodeList } from '../../../../commons/actions/currencyCodeList';
import VendorDialog, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/Vendor';

import {
  generateVendorTypes,
  initialSortCondition,
  Vendor,
  vendorTypes,
} from '../../../../domain/models/exp/Vendor';

import { State } from '../../../modules';
import { actions as eiSearchAction } from '../../../modules/ui/expenses/dialog/extendedItem/search';
import { actions as personalListAction } from '../../../modules/ui/expenses/dialog/vendor/personalList';
import { actions as vendorRecentlyUsedAction } from '../../../modules/ui/expenses/dialog/vendor/recentlyUsed';
import { actions as vendorTypeAction } from '../../../modules/ui/expenses/dialog/vendor/type';

import {
  openVendorCreateDialog,
  openVendorEditDialog,
  withSkeletonLoading,
} from '../../../action-dispatchers/Dialog';
import {
  deleteVendor,
  getPersonalVendor,
  searchVendorLookup,
} from '../../../action-dispatchers/Vendor';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  companyId: state.userSetting.companyId,
  hintMsg: state.entities.exp.customHint.reportHeaderVendor,
  vendorRecentlyUsed: state.ui.expenses.dialog.vendor.recentlyUsed,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
  tabs: generateVendorTypes(state.userSetting, ownProps.isFinanceApproval),
  type: state.ui.expenses.dialog.vendor.type,
  personalList: state.ui.expenses.dialog.vendor.personal.list,
  isInvalidDisplay: state.ui.expenses.dialog.vendor.personal.isInvalidDisplay,
  employeeId: state.userSetting.employeeId,
  currencyCodeList: state.currencyCodeList,
  organizationSetting: state.userSetting.organizationSetting,
  useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
});

const mapDispatchToProps = {
  searchVendorLookup,
  clearVendorRecentlyUsedDialog: vendorRecentlyUsedAction.clear,
  clearVendorSearchDialog: eiSearchAction.clear,
  openVendorCreateDialog,
  getPersonalList: personalListAction.get,
  getPersonalVendor,
  deleteVendor,
  fetchCurrencyCodeList,
  openVendorEditDialog,
  withSkeletonLoading,
  setType: vendorTypeAction.set,
  resetType: vendorTypeAction.clear,
  clearPersonalList: personalListAction.clear,
  toggleActive: personalListAction.toggle,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onVendorSearch: (query) =>
    // @ts-ignore
    dispatchProps.searchVendorLookup(stateProps.companyId, query),
  onClickVendorItem: (item) => {
    const expReport = cloneDeep(ownProps.expReport);
    const touched = cloneDeep(ownProps.touched);

    expReport.vendorId = item.id;
    expReport.vendorName = item.name;
    expReport.vendorCode = item.code;
    expReport.paymentDueDateUsage = item.paymentDueDateUsage;
    expReport.paymentDueDate = '';
    if (stateProps.useJctRegistrationNumber) {
      expReport.vendorJctRegistrationNumber = item.jctRegistrationNumber;
      expReport.vendorIsJctQualifiedIssuer = item.isJctQualifiedInvoiceIssuer;
    }
    touched.vendorId = true;
    touched.vendorName = true;
    touched.vendorCode = true;
    ownProps.onChangeEditingExpReport('report', expReport, touched);

    dispatchProps.clearVendorSearchDialog();
    dispatchProps.clearVendorRecentlyUsedDialog();
    dispatchProps.resetType();
    dispatchProps.clearPersonalList();
    ownProps.hideDialog();
  },
  onSelectPersonalVendor: async (id: string) => {
    const targetVendor = find(stateProps.personalList, ['id', id]);
    const isActive = targetVendor.active;
    if (!isActive) {
      return;
    }
    const expReport = cloneDeep(ownProps.expReport);
    const touched = cloneDeep(ownProps.touched);
    // @ts-ignore
    dispatchProps.getPersonalVendor(id).then((item) => {
      const { name, code, paymentDueDateUsage } = item;
      expReport.vendorId = id;
      expReport.vendorName = name;
      expReport.vendorCode = code;
      expReport.paymentDueDateUsage = paymentDueDateUsage;
      expReport.paymentDueDate = '';
      if (stateProps.useJctRegistrationNumber) {
        expReport.vendorJctRegistrationNumber = item.jctRegistrationNumber;
        expReport.vendorIsJctQualifiedIssuer = item.isJctQualifiedInvoiceIssuer;
      }
      touched.vendorId = true;
      touched.vendorName = true;
      touched.vendorCode = true;
      ownProps.onChangeEditingExpReport('report', expReport, touched);
      dispatchProps.clearVendorSearchDialog();
      dispatchProps.clearVendorRecentlyUsedDialog();
      dispatchProps.resetType();
      dispatchProps.clearPersonalList();
      ownProps.hideDialog();
    });
  },
  getPersonalList: () => {
    if (isEmpty(stateProps.personalList)) {
      const { companyId } = stateProps;
      const employeeId =
        ownProps.expReport.employeeBaseId || stateProps.employeeId;
      dispatchProps.withSkeletonLoading(() =>
        dispatchProps.getPersonalList({
          employeeId,
          companyId,
          sortCondition: initialSortCondition,
        })
      );
    }
  },
  onClickNewVendor: () => {
    dispatchProps.setType(vendorTypes.PERSONAL);
    dispatchProps.openVendorCreateDialog();
  },
  onClickDeleteVendorItem: (vendorInfo: Vendor) => {
    const item = stateProps.personalList.find((o) => o.id === vendorInfo.id);
    dispatchProps.deleteVendor(item);
  },
  getPersonalVendorDetail: (id: string) => {
    dispatchProps.setType(vendorTypes.PERSONAL);
    dispatchProps.openVendorEditDialog();
    dispatchProps.withSkeletonLoading(() =>
      dispatchProps.getPersonalVendor(id, true)
    );
  },
  searchCurrencyCode: () => {
    if (isEmpty(stateProps.currencyCodeList)) {
      dispatchProps.fetchCurrencyCodeList();
    }
  },
  onClickHideDialogButton: () => {
    dispatchProps.resetType();
    dispatchProps.clearPersonalList();
    ownProps.onClickHideDialogButton();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(VendorDialog) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
