import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../../modules';
import { actions as detailActions } from '../../modules/ui/attLegalAgreement/detail';
import { togglePane } from '../../modules/ui/attLegalAgreement/isExpanded';
import { selectors as filterTermsSelector } from '../../modules/ui/attLegalAgreement/list/filterTerms';

import * as AttLegalAgreementActions from '../../action-dispatchers/AttLegalAgreement';

import Detail from '../../components/attendance/AttLegalAgreementProcess/Detail';

const mapStateToProps = (state: State) => {
  const { detail } = state.entities.attLegalAgreement;
  const listedIds = filterTermsSelector.extractIdsByFilter(state);

  // 一覧に表示されていれば、内容を表示する（フィルターを考慮）
  return listedIds.includes(detail?.request.id)
    ? {
        id: detail.request.id,
        request: detail,
        userPhotoUrl: state.userSetting.photoUrl,
        approvalComment: state.ui.attLegalAgreement.detail.comment,
        originalRequestStatus: detail.originalRequest?.status,
        isExpanded: state.ui.attLegalAgreement.isExpanded,

        // The following use only in mergeProps
        _approvalType: state.ui.approvalType,
        _listedIds: filterTermsSelector.extractIdsByFilter(state),
      }
    : { id: '' };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      editComment: detailActions.editComment,
      reject: AttLegalAgreementActions.reject,
      approve: AttLegalAgreementActions.approve,
      togglePane,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickApproveButton: () =>
    dispatchProps.approve(
      [stateProps.id],
      stateProps.approvalComment,
      stateProps._approvalType,
      stateProps._listedIds
    ),
  onClickRejectButton: () =>
    dispatchProps.reject(
      [stateProps.id],
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
