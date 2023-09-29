import { connect } from 'react-redux';

import DetailWrapper, {
  Props,
} from '../../../../commons/components/exp/VendorDetail/DetailWrapper';

import { State } from '../../../modules';

import { withSkeletonLoading } from '../../../action-dispatchers/Dialog';
import { searchVendorDetail } from '../../../action-dispatchers/Vendor';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  activeVendor: state.ui.expenses.dialog.vendor.search,
  vendorId: ownProps.expReport.vendorId,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
});

const mapDispatchToProps = { searchVendorDetail, withSkeletonLoading };

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,

  closePanel: () => {
    ownProps.hideAllDialogsAndClear();
  },
  // @ts-ignore
  searchVendorDetail: (vendorId) => {
    const isCached =
      stateProps.activeVendor && stateProps.activeVendor.id === vendorId;
    if (isCached) {
      return new Promise((resolve) =>
        resolve({ records: [stateProps.activeVendor] })
      );
    } else {
      return dispatchProps.withSkeletonLoading(() =>
        dispatchProps.searchVendorDetail(vendorId)
      );
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailWrapper) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
