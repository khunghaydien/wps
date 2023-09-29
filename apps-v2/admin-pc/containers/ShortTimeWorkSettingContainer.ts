import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';
import { createSelector } from 'reselect';

import { searchShortTimeWorkReason } from '../actions/shortTimeWorkReason';
import * as shortTimeWorkSetting from '../actions/shortTimeWorkSetting';

import ShortTimeWorkSetting from '../presentational-components/ShortTimeWorkSetting';

// TODO: 共通化を検討する ※マスタの依存を解決する処理
const selectSearchShortTimeWorkSetting = (state) =>
  state.searchShortTimeWorkSetting;
const selectShortTimeWorkReasonList = (state) =>
  state.sfObjFieldValues.reasonId;

const injectReasonToEachShortTimeWorkSetting = createSelector(
  selectSearchShortTimeWorkSetting,
  selectShortTimeWorkReasonList,
  (shortTimeWorkSettingList, shortTimeWorkReasonList) =>
    shortTimeWorkSettingList.map((setting) => ({
      ...setting,
      reason: (shortTimeWorkReasonList || []).filter(
        (reason) => reason.id === setting.reasonId
      )[0],
    }))
);

const mapStateToProps = (state) => ({
  searchShortTimeWorkSetting: injectReasonToEachShortTimeWorkSetting(state),
  value2msgkey: state.value2msgkey,
});

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: shortTimeWorkSetting.searchShortTimeWorkSetting,
    create: shortTimeWorkSetting.createShortTimeWorkSetting,
    update: shortTimeWorkSetting.updateShortTimeWorkSetting,
    delete: shortTimeWorkSetting.deleteShortTimeWorkSetting,
    createHistory: shortTimeWorkSetting.createHistoryShortTimeWorkSetting,
    searchHistory: shortTimeWorkSetting.searchHistoryShortTimeWorkSetting,
    updateHistory: shortTimeWorkSetting.updateHistoryShortTimeWorkSetting,
    deleteHistory: shortTimeWorkSetting.deleteHistoryShortTimeWorkSetting,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, shortTimeWorkSetting, {
        searchShortTimeWorkReason,
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
)(ShortTimeWorkSetting);
