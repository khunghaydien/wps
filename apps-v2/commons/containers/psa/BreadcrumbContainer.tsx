import { connect } from 'react-redux';

import get from 'lodash/get';
import moment from 'moment';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';
import Breadcrumb from '@commons/components/psa/Breadcrumb';

import { actions as modeActions } from '@psa/modules/ui/mode';

import {
  getFinanceDetailContractFixed,
  getFinanceDetailContractTnM,
} from '@psa/action-dispatchers/Finance';
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
  labourFinanceType: state.entities.psa.projectFinance.labourFinanceType,
  financeDetailTitle:
    state.entities.psa.projectFinance.selectedFinanceDetail &&
    state.entities.psa.projectFinance.selectedFinanceDetail.label,
  projectFinanceDetail: state.entities.psa.projectFinance.projectFinanceDetail,
  financeCategoryName:
    state.entities.psa.projectFinance.projectFinanceDetail &&
    state.entities.psa.projectFinance.projectFinanceDetail.financeCategoryName,
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
  getFinanceDetailContractFixed,
  getFinanceDetailContractTnM,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickBackToProjectList: () => {
    dispatchProps.backToProjectList(
      stateProps.companyId,
      stateProps.pageNum,
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
    const jobIdsArray = stateProps.roleRequestFilterState.jobGradeIds.map(
      (jobGrades) => jobGrades.id
    );
    dispatchProps.backToRequestList(
      stateProps.companyId,
      stateProps.pageNum,
      formatDateRangeInFilter({
        ...stateProps.roleRequestFilterState,
        jobGradeIds: jobIdsArray,
      })
    );
  },
  backToFinanceDetail: () => {
    const contractType = stateProps.projectFinanceDetail.contractType;
    const projectId = stateProps.projectFinanceDetail.projectId;
    const financeCategoryId = stateProps.projectFinanceDetail.financeCategoryId;
    const recordType = stateProps.projectFinanceDetail.recordType;
    if (recordType === 'Sales') {
      if (contractType === 'Fixed') {
        dispatchProps.getFinanceDetailContractFixed(
          projectId,
          financeCategoryId
        );
      } else if (contractType === 'TnM') {
        dispatchProps.getFinanceDetailContractTnM(projectId, financeCategoryId);
      }
    } else if (recordType === 'ResourceCost') {
      dispatchProps.getFinanceDetailContractTnM(projectId, financeCategoryId);
    }
  },
  backToRequestSelection: () => {
    dispatchProps.goToRequestSelection(
      stateProps.companyId,
      stateProps.pageNum,
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
