import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../../modules';
import { selectors as detailSelectors } from '../../modules/entities/attMonthly/detail';
import { actions as detailActions } from '../../modules/ui/attMonthly/detail';
import { togglePane } from '../../modules/ui/attMonthly/isExpanded';
import { selectors as filterTermsSelector } from '../../modules/ui/attMonthly/list/filterTerms';

import Detail from '../../components/AttMonthlyProcessListPane/Detail';

const mapStateToProps = (state: State) => {
  const listedIds = filterTermsSelector.extractIdsByFilter(state);

  // 一覧に表示されていれば、内容を表示する（フィルターを考慮）
  return listedIds.includes(state.entities.attMonthly.detail.id)
    ? {
        requestId: state.entities.attMonthly.detail.id,
        status: state.entities.attMonthly.detail.status,
        employeeName: state.entities.attMonthly.detail.employeeName,
        employeePhotoUrl: state.entities.attMonthly.detail.employeePhotoUrl,
        delegatedEmployeeName:
          state.entities.attMonthly.detail.delegatedEmployeeName,
        requestComment: state.entities.attMonthly.detail.comment,
        records: detailSelectors.recordsSelector(state),
        attentions: state.entities.attMonthly.detail.attentions.byId,
        attentionSummary: state.entities.attMonthly.detail.attentions.summary,
        closingDate: detailSelectors.closingDateSelector(state) || '',
        restTimeTotal: detailSelectors.restTimeTotalSelector(state),
        realWorkTimeTotal: detailSelectors.realWorkTimeTotalSelector(state),
        overTimeTotal: detailSelectors.overTimeTotalSelector(state),
        nightTimeTotal: detailSelectors.nightTimeTotalSelector(state),
        lostTimeTotal: detailSelectors.lostTimeTotalSelector(state),
        virtualWorkTimeTotal:
          detailSelectors.virtualWorkTimeTotalSelector(state),
        holidayWorkTimeTotal:
          detailSelectors.holidayWorkTimeTotalSelector(state),
        summaries: detailSelectors.summariesSelector(state),
        historyList: detailSelectors.historyListSelector(state),
        approvalComment: state.ui.attMonthly.detail.comment,
        userPhotoUrl: state.userSetting.photoUrl,
        isExpanded: state.ui.attMonthly.isExpanded,

        // The following use only in mergeProps
        _approvalType: state.ui.approvalType,
        _listedIds: filterTermsSelector.extractIdsByFilter(state),
      }
    : {
        requestId: '',
      };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      editComment: detailActions.editComment,
      reject: detailActions.reject,
      approve: detailActions.approve,
      togglePane,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  approve: () =>
    dispatchProps.approve(
      [stateProps.requestId],
      stateProps.approvalComment,
      stateProps._approvalType,
      stateProps._listedIds
    ),
  reject: () =>
    dispatchProps.reject(
      [stateProps.requestId],
      stateProps.approvalComment,
      stateProps._approvalType,
      stateProps._listedIds
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Detail) as React.ComponentType<Record<string, any>>;
