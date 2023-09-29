import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../../modules';
import { actions as detailActions } from '../../modules/ui/attMonthly/detail';
import { togglePane } from '../../modules/ui/attMonthly/isExpanded';
import { selectors as filterTermsSelector } from '../../modules/ui/attMonthly/list/filterTerms';

import Detail from '../../components/attendance/AttMonthlyFixProcessListPane/Detail';

const mapStateToProps = (state: State) => {
  const listedIds = filterTermsSelector.extractIdsByFilter(state);

  // 一覧に表示されていれば、内容を表示する（フィルターを考慮）
  return listedIds.includes(state.entities.attMonthly.detail?.id)
    ? {
        summary: state.entities.attMonthly.detail,
        userPhotoUrl: state.userSetting.photoUrl,
        approvalComment: state.ui.attMonthly.detail.comment,
        isExpanded: state.ui.attMonthly.isExpanded,

        // The following use only in mergeProps
        _approvalType: state.ui.approvalType,
        _listedIds: filterTermsSelector.extractIdsByFilter(state),
      }
    : {
        summary: null,
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
      [stateProps.summary.id],
      stateProps.approvalComment,
      stateProps._approvalType,
      stateProps._listedIds
    ),
  reject: () =>
    dispatchProps.reject(
      [stateProps.summary.id],
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
