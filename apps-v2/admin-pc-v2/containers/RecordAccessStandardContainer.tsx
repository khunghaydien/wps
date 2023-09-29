import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RecordAccessPermissionEnum } from '../models/recordAccess/RecordAccess';

import { setModeBase } from '@admin-pc/modules/base/detail-pane/ui';

import { getChildDepartments } from '@admin-pc-v2/action-dispatchers/department/Detail';
import * as recordAccess from '@admin-pc-v2/actions/recordAccess';

import { State } from '@admin-pc-v2/reducers';

import RecordAccessStandard from '@apps/admin-pc-v2/presentational-components/RecordAccessStandard';

const mapStateToProps = (state: State) => {
  return {
    recordAccess: state.recordAccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: (param: recordAccess.SearchRecordAccessRequest) =>
      recordAccess.searchRecordAccess({
        ...param,
        permissionTypes: [RecordAccessPermissionEnum.STANDARD],
      }),
    create: (param: recordAccess.RecordAccessCreateRequest) =>
      recordAccess.createRecordAccess({
        ...param,
        permissionType: RecordAccessPermissionEnum.STANDARD,
      }),
    delete: recordAccess.deleteRecordAccess,
    update: recordAccess.updateRecordAccess,
    getRecord: recordAccess.getRecord,
    createRecordAccessHierarchy: recordAccess.createRecordAccessHierarchy,
    getChildDepartments,
    setModeBase,
  };
  const actions = bindActionCreators(alias, dispatch);
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(RecordAccessStandard);
