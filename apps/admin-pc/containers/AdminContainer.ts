import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import companySettings from '@admin-pc/constants/Setting/companySettings';
import orgSettings from '@admin-pc/constants/Setting/orgSettings';

import { catchBusinessError } from '../../commons/actions/app';
import { selectTab } from '../../commons/actions/tab';
import { getUserSetting } from '../../commons/actions/userSetting';
import { buildPermissionChecker } from '../../commons/modules/accessControl/permission';

import { initializeDetailPane } from '../modules/base/detail-pane/ui';
import { changeCompany, selectMenuItem } from '../modules/base/menu-pane/ui';

import { searchCompany } from '../actions/company';
import { initializeEditRecord, setEditRecord } from '../actions/editRecord';
import { getLanguagePickList } from '../actions/language';
import { getOrganizationSetting } from '../actions/organization';

import Admin from '../components/Admin';

export const mapStateToProps = (state) => {
  return {
    userSetting: state.common.userSetting,
    getOrganizationSetting: state.getOrganizationSetting,
    searchCompany: state.searchCompany,
    selectedTab: state.common.selectedTab,
    editRecord: state.editRecord,
    tmpEditRecord: state.tmpEditRecord,
    hasPermission: buildPermissionChecker(state),
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        onSelectMenuItem: selectMenuItem,
        onChangeCompany: (param) => (thunkDispatch) => {
          thunkDispatch(changeCompany(param));
        },
      },
      dispatch
    ),
    actions: bindActionCreators(
      {
        catchBusinessError,
        getOrganizationSetting,
        getUserSetting,
        getLanguagePickList,
        initializeDetailPane,
        initializeEditRecord,
        setEditRecord,
        searchCompany,
        selectTab,
      },
      dispatch
    ),
  };
}

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  companySettings,
  orgSettings,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Admin);
