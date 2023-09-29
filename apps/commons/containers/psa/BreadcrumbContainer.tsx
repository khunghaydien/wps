import { connect } from 'react-redux';

import get from 'lodash/get';
import moment from 'moment';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';
import Breadcrumb from '@commons/components/psa/Breadcrumb';

import { actions as modeActions } from '@psa/modules/ui/mode';

import { backToProjectList } from '@psa/action-dispatchers/Project';
import { nonOverlapProject, overlapProject } from '@psa/action-dispatchers/PSA';
import {
  backToRequestList,
  goToRequestSelection,
} from '@resource/action-dispatchers/Request';
import {
  setResourceAvailability,
  viewAllResources,
} from '@resource/action-dispatchers/Resource';
import { selectRole } from '@resource/action-dispatchers/Role';

import { formatDateRangeInFilter } from '@resource/utils';

const mapStateToProps = (state) => ({
  companyId: state.userSetting.companyId,
  currentRoute: state.ui.tab,
  mode: state.ui.mode,
  pageNum: state.entities.psa.project.pageNum,
  projectListFilterState: state.ui.filter.project,
  resourceList: state.entities.psa.resource.resourceList,
  roleRequestFilterState: state.ui.filter.roleRequest,
  roleRequestSelectionFilterState: state.ui.filter.requestSelection,
  selectedProjectName: state.entities.psa.project.project.name,
  selectedResourceName: get(state.ui.resourceSelection, 'resource.name', ''),
  selectedRoleId: state.entities.psa.role.role.roleId,
  selectedRoleTitle: state.entities.psa.role.role.roleTitle,
  siteRoute: state.ui.siteRoute,
  requestListPageSize: state.entities.psa.request.pageSize,
  requestListPageNum: state.entities.psa.request.pageNum,
  selectedGroup: state.entities.psa.psaGroup.selectedGroup,
});

const mapDispatchToProps = {
  backToProjectList,
  backToRequestList,
  confirm,
  goToRequestSelection,
  initializeMode: modeActions.initialize,
  nonOverlapProject,
  overlapProject,
  selectRole,
  setResourceAvailability,
  viewAllResources,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickBackToProjectList: () => {
    dispatchProps.backToProjectList(
      stateProps.companyId,
      stateProps.pageNum,
      stateProps.selectedGroup.id,
      stateProps.projectListFilterState
    );
  },
  onClickBackToProjectListConfirmation: () => {
    dispatchProps.confirm(msg().Psa_Msg_ConfirmDiscardChanges, (yes) => {
      if (yes) {
        dispatchProps.nonOverlapProject();
        dispatchProps.initializeMode();
      }
    });
  },
  onClickBackToSelectedRole: () => {
    dispatchProps.selectRole(stateProps.selectedRoleId);
  },
  onClickBackToRoleRequestList: () => {
    dispatchProps.backToRequestList(
      stateProps.companyId,
      stateProps.requestListPageNum,
      stateProps.selectedGroup.id,
      formatDateRangeInFilter({
        ...stateProps.roleRequestFilterState,
        jobGradeIds: stateProps.roleRequestFilterState.jobGradeIds
          ? stateProps.roleRequestFilterState.jobGradeIds.map(
              (jobGrade: any) => jobGrade.id
            )
          : null,
      }),
      stateProps.requestListPageSize
    );
  },
  backToRequestSelection: () => {
    dispatchProps.goToRequestSelection(
      stateProps.companyId,
      stateProps.pageNum,
      stateProps.selectedGroup.id,
      stateProps.roleRequestSelectionFilterState
    );
  },
  backToViewAllResources: () => {
    dispatchProps.setResourceAvailability(
      processView(
        0,
        stateProps.resourceList.map((resource) => resource.availability),
        'day',
        '',
        moment().format('YYYY-MM-01')
      )
    );
    dispatchProps.viewAllResources();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Breadcrumb);
