import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setModeBase } from '@admin-pc/modules/base/detail-pane/ui';

import * as organizationHierarchy from '@apps/admin-pc/actions/organizationHierarchy';

import { State } from '@admin-pc-v2/reducers';

import OrganizationHierarchy from '@admin-pc-v2/presentational-components/OrganizationHierarchy';

const mapStateToProps = (state: State) => ({
  itemList: state.searchOrganizationHierarchy,
  isShowDetail: state.base.detailPane.ui.isShowDetail,
  editRecord: state.editRecord,
  companyId: state.base.menuPane.ui.targetCompanyId,
  dialog: state.departmentManager.ui.dialog,
  value2msgkey: state.value2msgkey,
  sortCondition: state.base.listPane.ui.sortCondition,
});

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: organizationHierarchy.createOrganizationHierarchy,
    update: organizationHierarchy.updateOrganizationHierarchy,
    delete: organizationHierarchy.deleteOrganizationHierarchy,
    search: organizationHierarchy.searchOrganizationHierarchy,
    getConstants: organizationHierarchy.getConstantsOrganizationHierarchy,
    setModeBase,
  };
  const actions = bindActionCreators(alias, dispatch);
  return { actions };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrganizationHierarchy);
