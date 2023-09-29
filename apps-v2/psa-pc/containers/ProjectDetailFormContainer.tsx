import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import projectDetailFormSchema from '@psa/schema/ProjectDetailForm';

import { catchBusinessError, confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { OpportunityDefaultParam } from '@apps/domain/models/psa/Opportunity';
import {
  searchClientList as searchClientListApi,
  searchEmployeeList as searchEmployeeListApi,
} from '@apps/domain/models/psa/Project';

import { State } from '@psa/modules';
import { actions as modeActions } from '@psa/modules/ui/mode';
import { SIDEBAR_TYPES } from '@psa/modules/ui/sidebar';

import { getClientList } from '@psa/action-dispatchers/Client';
import { getOpportunityList } from '@psa/action-dispatchers/Opportunity';
import {
  backToProjectList,
  saveProject,
} from '@psa/action-dispatchers/Project';
import saveProjectManagerLocally from '@psa/action-dispatchers/ProjectManager';
import {
  openDeleteProjectDialog,
  openGenerateProjectLinkDialog,
  switchToSidebar,
} from '@psa/action-dispatchers/PSA';
import { getExtendedItemList } from '@psa/action-dispatchers/PsaExtendedItem';
import getResourcegroups from '@psa/action-dispatchers/ResourceGroup';
import { getGroupMembers } from '@resource/action-dispatchers/ResourceGroup';

import ProjectDetail from '@psa/components/ProjectScreen/ProjectDetail';

// Selector
export function getManagerList(suggestList: any) {
  const { employeeList, records } = suggestList;
  const results = employeeList || records;

  return results && results.length > 0
    ? results.map((employee) => ({
        code: employee.code,
        id: employee.id,
        name: employee.displayName,
      }))
    : results;
}

export function getCalendarList(state: any) {
  const { calendarList } = state.entities;

  return calendarList && calendarList.length > 0
    ? calendarList.map((calendar) => ({
        value: calendar.id,
        text: calendar.name,
      }))
    : calendarList;
}

type Props = {
  permission: string;
};

const ProjectDetailFormContainer = (ContainerProps: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const activityList = useSelector(
    (state: State) => state.entities.psa.activity.activityList
  );
  const calendarListOption = useSelector((state: State) =>
    getCalendarList(state)
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const deptSuggestList = useSelector(
    (state: State) => state.entities.departmentList
  );
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const extendedItemConfigList = useSelector(
    (state: State) => state.entities.psa.psaExtendedItem.project
  );
  const groupDetail = useSelector(
    (state: State) => state.entities.psa.resourceGroup.detail
  );
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const managerListOption = useSelector((state: State) =>
    getManagerList(state.entities)
  );
  const mode = useSelector((state: State) => state.ui.mode);
  const pageNum = useSelector(
    (state: State) => state.entities.psa.project.pageNum
  );
  const projectListFilterState = useSelector(
    (state: State) => state.ui.filter.project
  );
  const projectManagerId = useSelector(
    (state: State) => state.entities.psa.projectManager.projectManagerId
  );
  const resourceGroupList = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const opportunityList = useSelector(
    (state: State) => state.entities.clientInfo.opportunity.opportunities
  );

  const clientList = useSelector(
    (state: State) => state.entities.clientInfo.client.clientList
  );

  const resourceManagerList = useSelector(
    (state: State) => state.entities.psa.resourceManager.resourceManagerList
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const useExistingJobCode = useSelector(
    (state: State) => state.entities.psa.setting.useExistingJobCode
  );
  const enableProgressCheck = useSelector(
    (state: State) => state.entities.psa.setting.enableProgressCheck
  );
  const currencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const clientId = useSelector(
    (state: State) => state.entities.psa.project.project.clientId
  );
  const clientName = useSelector(
    (state: State) => state.entities.psa.project.project.clientName
  );
  const customHint = useSelector((state: State) => state.entities.customHint);

  for (const [key, value] of Object.entries(customHint)) {
    if (value !== null) {
      customHint[key] = value.replace('\n', '<br>');
    }
  }

  useEffect(() => {
    dispatch(
      getClientList({ name: '', searchEmptyName: true, recordsLimit: 100 })
    );
    dispatch(getResourcegroups(companyId));
    dispatch(getOpportunityList(OpportunityDefaultParam));
    dispatch(getExtendedItemList(companyId, 'Project'));
  }, []);

  const onClickCancel = () => {
    dispatch(
      confirm(msg().Psa_Msg_ConfirmDiscardChanges, (yes) => {
        if (yes) {
          dispatch(switchToSidebar(SIDEBAR_TYPES.ACTIVITY));
        }
      })
    );
  };

  const onClickBackToProjectList = () => {
    dispatch(backToProjectList(companyId, pageNum, projectListFilterState));
  };

  const searchEmployeeList = (value) => searchEmployeeListApi(companyId, value);

  const generateInitialValues = () => {
    // Transform the object such that id to serve as unique identifier for formik validation
    const transformedExtendeditems = {};
    selectedProject.extendedItems &&
      selectedProject.extendedItems.length > 0 &&
      selectedProject.extendedItems.forEach((x) => {
        transformedExtendeditems[x.id] = x.value;
      });
    return {
      code: selectedProject.code,
      companyId: selectedProject.companyId,
      description: selectedProject.description,
      clientId: selectedProject.clientId,
      contractType: selectedProject.contractType || 'TnM',
      contractAmount: selectedProject.contractAmount,
      targetMargin: selectedProject.targetMargin || 0,
      deptId: selectedProject.deptId,
      endDate: selectedProject.endDate,
      pmBaseId: selectedProject.pmBaseId,
      groupId: selectedProject.groupId,
      name: selectedProject.name,
      opportunityId: selectedProject.opportunityId,
      projectId: selectedProject.projectId,
      planningCycle: selectedProject.planningCycle,
      startDate: selectedProject.startDate,
      status: selectedProject.status || 'Planning',
      jobId: selectedProject.jobId || '',
      jobCode: selectedProject.jobCode || '',
      workTimePerDay: selectedProject.workTimePerDay || '',
      progressCheckFrequency: selectedProject.progressCheckFrequency,
      calendarId: selectedProject.calendarId,
      workingDaySUN: selectedProject.workingDaySUN,
      workingDayMON: selectedProject.workingDayMON,
      workingDayTUE: selectedProject.workingDayTUE,
      workingDayWED: selectedProject.workingDayWED,
      workingDayTHU: selectedProject.workingDayTHU,
      workingDayFRI: selectedProject.workingDayFRI,
      workingDaySAT: selectedProject.workingDaySAT,
      ...transformedExtendeditems,
      extendedItemConfigList: extendedItemConfigList || [],
      useExistingJobCode,
      enableProgressCheck,
      pushNotificationDay: selectedProject.pushNotificationDay,
      pushNotificationDate: selectedProject.pushNotificationDate,
    };
  };

  const isNeedToResetProgress = (project) => {
    return (
      activityList &&
      activityList.length > 0 &&
      (!isEqual(
        selectedProject.progressCheckFrequency,
        project.progressCheckFrequency
      ) ||
        !isEqual(selectedProject.firstCheckDate, project.firstCheckDate))
    );
  };

  const handleSubmit = (values) => {
    const project: any = cloneDeep(values);
    const extendedItems = [];
    if (extendedItemConfigList) {
      extendedItemConfigList.forEach((eI) => {
        extendedItems.push({
          id: eI.id,
          value: values[eI.id],
          name: eI.name,
        });
        delete project[eI.id];
      });
    }
    if (project && project.contractType && project.contractType === 'TnM') {
      project.contractAmount = Number(0);
    }
    delete project.extendedItemConfigList;
    project.extendedItems = extendedItems;
    selectedProject.extendedItemValueId &&
    selectedProject.extendedItemValueId !== ''
      ? (project.extendedItemValueId = selectedProject.extendedItemValueId)
      : (project.extendedItemValueId = '');

    // remove ui values
    if (!useExistingJobCode) {
      delete project.jobId;
    }
    delete project.jobCode;
    delete project.useExistingJobCode;
    delete project.enableProgressCheck;

    if (isNeedToResetProgress(project)) {
      dispatch(
        confirm(msg().Psa_Msg_ConfirmProgressChanges, (yes) => {
          if (yes) {
            dispatch(saveProject(project, companyId));
          }
        })
      );
    } else {
      dispatch(saveProject(project, companyId));
    }
  };

  const Actions = bindActionCreators(
    {
      catchBusinessError,
      editProjectMode: modeActions.editProject,
      onClickDeleteProject: openDeleteProjectDialog,
      onClickGenerateProjectLink: openGenerateProjectLinkDialog,
      saveProjectManagerLocally,
      getGroupMembers,
    },
    dispatch
  );

  return (
    <Formik
      enableReinitialize
      initialValues={generateInitialValues()}
      validationSchema={projectDetailFormSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <ProjectDetail
            permission={ContainerProps.permission}
            activeDialog={activeDialog}
            activityList={activityList}
            backToProjectList={onClickBackToProjectList}
            calendarListOption={calendarListOption}
            clientList={clientList}
            clientId={clientId}
            clientName={clientName}
            companyId={companyId}
            customHint={customHint}
            deptSuggestList={deptSuggestList}
            dirty={props.dirty}
            editProjectMode={Actions.editProjectMode}
            employeeId={employeeId}
            errors={props.errors}
            extendedItemConfigList={extendedItemConfigList}
            getGroupMembers={Actions.getGroupMembers}
            getManagerList={getManagerList}
            groupDetail={groupDetail}
            handleSubmit={props.handleSubmit}
            managerListOption={managerListOption}
            mode={mode}
            onClickCancel={onClickCancel}
            onClickDeleteProject={Actions.onClickDeleteProject}
            onClickGenerateProject={Actions.onClickGenerateProjectLink}
            opportunityList={opportunityList}
            projectManagerId={projectManagerId}
            resourceGroupList={resourceGroupList}
            resourceManagerList={resourceManagerList}
            saveProjectManagerLocally={Actions.saveProjectManagerLocally}
            searchEmployeeList={searchEmployeeList}
            searchClientList={searchClientListApi}
            selectedProject={selectedProject}
            setFieldValue={props.setFieldValue}
            touched={props.touched}
            useExistingJobCode={useExistingJobCode}
            values={props.values}
            catchBusinessError={Actions.catchBusinessError}
            enableProgressCheck={enableProgressCheck}
            isLoading={isLoading}
            currencyDecimal={currencyDecimal}
            validateForm={props.validateForm}
          />
        );
      }}
    </Formik>
  );
};

export default ProjectDetailFormContainer;
