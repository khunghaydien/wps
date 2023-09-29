import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as uiActions } from '../../modules/ui/timeTrack/isExpanded';
import { actions as requetActions } from '../../modules/ui/timeTrack/request';
import { State } from '@apps/approvals-pc/modules';

import Detail from '../../components/TrackinglProcessListPane/Detail';

const mapStateToProps = (state: State) => {
  return {
    isExpand: state.ui.timeTrack.isExpanded,
    employeeName: state.entities.timeTrack.detail.employeeName,
    employeePhotoUrl: state.entities.timeTrack.detail.employeePhotoUrl,
    status: state.entities.timeTrack.detail.status,
    comment: state.entities.timeTrack.detail.comment,
    dailyTrackList: state.entities.timeTrack.detail.dailyTrackList,
    taskList: state.entities.timeTrack.detail.taskList.byId,
    taskIdList: state.entities.timeTrack.detail.taskList.allIds,
    startDate: state.entities.timeTrack.detail.startDate,
    endDate: state.entities.timeTrack.detail.endDate,
    selectedId: state.entities.timeTrack.detail.requestId,
    historyList: state.entities.histories,
    requestId: state.entities.timeTrack.detail.requestId,
    requestComment: state.ui.timeTrack.request.comment,
    userPhotoUrl: state.userSetting.photoUrl,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    togglePane: bindActionCreators(uiActions.togglePane, dispatch),
    approve: bindActionCreators(requetActions.approve, dispatch),
    reject: bindActionCreators(requetActions.reject, dispatch),
    editComment: bindActionCreators(requetActions.editComment, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
