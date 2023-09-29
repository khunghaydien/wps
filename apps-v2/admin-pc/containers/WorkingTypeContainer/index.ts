import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

// import configList from '../../constants/configList/workingType';
import { actions as detailActions } from '../../modules/workingType/ui/detail';
import { actions as listActions } from '../../modules/workingType/ui/list';
import { actions as searchConditionActions } from '../../modules/workingType/ui/searchCondition';

import { searchAllowance } from '../../actions/allowance';
import { searchAttExtendedItem } from '../../actions/attExtendedItem';
import { searchRecordDisplayFieldLayout } from '../../actions/attRecordDisplayFieldLayout';
import { searchRecordExtendedItemSet } from '../../actions/attRecordExtendedItemSet';
import { searchLateArrivalEarlyLeaveReason } from '../../actions/lateArrivalEarlyLeaveReason';
import { searchLeave } from '../../actions/leave';
import { searchObjectivelyEventLogSetting } from '../../actions/objectivelyEventLogSetting';
import { searchRestReason } from '../../actions/restReason';
import * as workingType from '../../actions/workingType';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
// import * as RecordUtil from '../../utils/RecordUtil';
import WorkingType, {
  Props,
} from '../../presentational-components/WorkingType';

const mapStateToProps = (state) => {
  return {
    selectedHistoryId: state.workingType.ui.detail.selectedHistoryId,
    searchCondition: state.workingType.ui.searchCondition,
    searchWorkingType: state.searchWorkingType,
    value2msgkey: state.value2msgkey,
    sfObjFieldValues: state.sfObjFieldValues,
    companyId: state.base.menuPane.ui.targetCompanyId,
    editRecord: state.editRecord,
    editRecordHistory: state.editRecordHistory,
    tmpEditRecord: state.tmpEditRecord,
    tmpEditRecordHistory: state.tmpEditRecordHistory,
    searchHistory: state.searchHistory,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: workingType.searchWorkingType,
    create: workingType.createWorkingType,
    update: workingType.updateWorkingType,
    delete: workingType.deleteWorkingType,
    createHistory: workingType.createHistoryWorkingType,
    searchHistory: workingType.searchHistoryWorkingType,
    updateHistory: workingType.updateHistoryWorkingType,
    deleteHistory: workingType.deleteHistoryWorkingType,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, workingType, {
        searchLeave,
        searchObjectivelyEventLogSetting,
        searchRestReason,
        searchAllowance,
        searchLateArrivalEarlyLeaveReason,
        setSelectedIndex: listActions.setSelectedCode,
        resetSelectedIndex: listActions.resetSelectedCode,
        setSelectedHistoryId: detailActions.setSelectedHistoryId,
        setSearchCondition: searchConditionActions.setNew,
        searchRecordExtendedItemSet,
        searchRecordDisplayFieldLayout,
        searchAttExtendedItem,
      }),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingType) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
