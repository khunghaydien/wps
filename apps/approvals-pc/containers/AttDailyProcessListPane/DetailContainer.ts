import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { AttDailyDetailForStore } from '../../../domain/models/approval/AttDailyDetail';

import { State } from '../../modules';
import * as detailSelectors from '../../modules/entities/att/detail/selectors';
import { togglePane } from '../../modules/ui/att/isExpanded';
import { selectors as filterTermsSelector } from '../../modules/ui/att/list/filterTerms';
import * as requestActions from '../../modules/ui/att/request/actions';

import Detail from '../../components/AttDailyProcessListPane/Detail';

const mapStateToProps = (state: State) => {
  const { detail }: { detail: AttDailyDetailForStore } = state.entities.att;
  const { request, originalRequest } = detail;

  const listedIds: string[] = filterTermsSelector.extractIdsByFilter(state);

  // 一覧に表示されていれば、内容を表示する（フィルターを考慮）
  return listedIds.includes(request.id)
    ? {
        id: request.id,
        statusLabel: detailSelectors.statusSelector(
          state.entities.att.detail.request.status
        ),
        employeeName: request.employeeName,
        employeePhotoUrl: request.employeePhotoUrl,
        historyList: detail.historyList,
        detailList: detailSelectors.detailListSelector(
          state.entities.att.detail
        ),
        userPhotoUrl: state.userSetting.photoUrl,
        approveComment: state.ui.att.request.comment,
        delegatedEmployeeName: request.delegatedEmployeeName,
        originalRequestStatus: originalRequest ? originalRequest.status : '',
        isExpanded: state.ui.att.isExpanded,

        // The following use only in mergeProps
        _approvalType: state.ui.approvalType,
        _listedIds: listedIds,
      }
    : { id: '' };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      editComment: requestActions.editComment,
      onClickApproveButton: requestActions.approve,
      onClickRejectButton: requestActions.reject,
      togglePane,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickApproveButton: () =>
    dispatchProps.onClickApproveButton(
      [stateProps.id],
      stateProps.approveComment,
      stateProps._approvalType,
      stateProps._listedIds
    ),
  onClickRejectButton: () =>
    dispatchProps.onClickRejectButton(
      [stateProps.id],
      stateProps.approveComment,
      stateProps._approvalType,
      stateProps._listedIds
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Detail) as React.ComponentType<Record<string, any>>;
