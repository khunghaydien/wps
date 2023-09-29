import { connect } from 'react-redux';

import { withFormik } from 'formik';
import last from 'lodash/last';

import { personalVendorSchema } from '@apps/commons/schema/Expense';

import PersonalVendor, {
  Props,
} from '@apps/commons/components/exp/Form/Dialog/Vendor/PersonalVendor';

import {
  initialVendor,
  VENDOR_PAYMENT_DUE_DATE_USAGE,
} from '@apps/domain/models/exp/Vendor';

import { State } from '@apps/expenses-pc/modules';
import { dialogTypes } from '@apps/expenses-pc/modules/ui/expenses/dialog/activeDialog';

import {
  saveVendor,
  updateVendor,
} from '@apps/expenses-pc/action-dispatchers/Vendor';

import { Props as OwnProps } from '@apps/expenses-pc/components/Expenses/Dialog';

const getCurrentDialog = (activeDialog) => last(activeDialog);

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const currentDialog = getCurrentDialog(state.ui.expenses.dialog.activeDialog);
  const isCreate = currentDialog === dialogTypes.VENDOR_CREATE;
  return {
    hintMsg: state.entities.exp.customHint.reportHeaderVendor,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    // selectedCompanyId from FA cross Company
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    isCreate,
    isLoading: !!state.ui.expenses.dialog.isLoading,
    employeeId: state.userSetting.employeeId,
    subroleId: state.ui.expenses.subrole.selectedRole,
    companyId: state.userSetting.companyId,
    vendorInfo: state.entities.exp.personalVendor,
    currencyCodeList: state.currencyCodeList,
    organizationSetting: state.userSetting.organizationSetting,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
  };
};

const mapDispatchToProps = {
  saveVendor,
  updateVendor,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  save: (values) => {
    const vendor = { ...values };
    vendor.paymentDueDateUsage =
      values.paymentDueDateUsage || VENDOR_PAYMENT_DUE_DATE_USAGE.Optional;
    vendor.companyId = stateProps.companyId;
    vendor.id = vendor.id || null;
    dispatchProps.saveVendor(
      vendor,
      stateProps.employeeId,
      stateProps.subroleId
    );
  },
  update: (values) => {
    const vendor = { ...values };
    vendor.paymentDueDateUsage =
      values.paymentDueDateUsage || VENDOR_PAYMENT_DUE_DATE_USAGE.Optional;
    vendor.companyId = stateProps.companyId;
    vendor.id = vendor.id || null;
    dispatchProps.updateVendor(
      vendor,
      stateProps.employeeId,
      stateProps.subroleId
    );
  },
});

const personalVendorForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props: Props) => {
    return props.isCreate ? initialVendor : props.vendorInfo;
  },
  validationSchema: personalVendorSchema,
  handleSubmit: (values, { props }: { props: Props }) => {
    const action = props.isCreate ? props.save : props.update;
    action(values);
  },
})(PersonalVendor);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(personalVendorForm) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
