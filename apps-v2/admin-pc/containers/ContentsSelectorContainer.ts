import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { catchBusinessError, confirm } from '../../commons/actions/app';

import {
  setModeBase,
  setModeHistory,
  showDetailPane,
} from '../modules/base/detail-pane/ui';

import {
  appendHistory,
  cancelEditing,
  changeHistory,
  changeRecordHistoryValue,
  changeRecordValue,
  create,
  hideDetail,
  initialize,
  removeBase,
  removeHistory,
  showDetail,
  showRevisionDialog,
  startEditingBase,
  startEditingClonedRecord,
  startEditingHistory,
  startEditingNewRecord,
  updateBase,
  updateHistory,
} from '../action-dispatchers/Edit';
import * as editRecord from '../actions/editRecord';
import * as getSFObjFieldValues from '../actions/sfObjFieldValues';

import ContentsSelector from '../components/Admin/ContentsSelector';

export const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    editRecordHistory: state.editRecordHistory,
    getOrganizationSetting: state.getOrganizationSetting,
    searchHistory: state.searchHistory,
    sfObjFieldValues: state.sfObjFieldValues,
    tmpEditRecord: state.tmpEditRecord,
    tmpEditRecordHistory: state.tmpEditRecordHistory,
    isShowDetail: state.detailPane.ui.isShowDetail,
    isShowRevisionDialog: state.detailPane.ui.isShowRevisionDialog,
    modeBase: state.detailPane.ui.modeBase,
    modeHistory: state.detailPane.ui.modeHistory,
  };
};

export const mapDispatchToProps = (dispatch) => {
  const commonActions = bindActionCreators(
    _.pickBy(
      Object.assign(
        {},
        { catchBusinessError, confirm },
        editRecord,
        { showDetailPane, setModeBase, setModeHistory },
        getSFObjFieldValues,
        {
          initialize,
          create,
          appendHistory,
          showDetail,
          hideDetail,
          showRevisionDialog,
          updateBase,
          updateHistory,
          removeBase,
          removeHistory,
          startEditingNewRecord,
          startEditingClonedRecord,
          startEditingBase,
          startEditingHistory,
          cancelEditing,
          changeHistory,
          changeRecordValue,
          changeRecordHistoryValue,
        }
      ),
      _.isFunction
    ),
    dispatch
  );
  return { commonActions };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentsSelector);
