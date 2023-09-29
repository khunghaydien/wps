import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';

import projectDetailFormSchema from '@psa/schema/ProjectDetailForm';

import { catchBusinessError, confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import {
  searchClientList as searchClientListApi,
  searchEmployeeList as searchEmployeeListApi,
} from '@apps/domain/models/psa/Project';

import { State } from '@psa/modules';
import { actions as modeActions } from '@psa/modules/ui/mode';
import { SIDEBAR_TYPES } from '@psa/modules/ui/sidebar';

import {
  backToProjectList,
  saveProject,
} from '@psa/action-dispatchers/Project';
import saveProjectManagerLocally from '@psa/action-dispatchers/ProjectManager';
import {
  openDeleteProjectDialog,
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

const ProjectDetailFormContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

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
  const resourceManagerList = useSelector(
    (state: State) => state.entities.psa.resourceManager.resourceManagerList
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const useExistingJobCode = useSelector(
    (state: State) => state.entities.psa.setting.useExistingJobCode
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );

  useEffect(() => {
    dispatch(getResourcegroups(companyId, selectedGroup.id));
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
    dispatch(
      backToProjectList(
        companyId,
        pageNum,
        selectedGroup.id,
        projectListFilterState
      )
    );
  };

  const searchEmployeeList = (value) =>
    searchEmployeeListApi(companyId, value, selectedGroup.id);

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
      deptId: selectedProject.deptId,
      endDate: selectedProject.endDate,
      pmBaseId: selectedProject.pmBaseId,
      groupId: selectedProject.groupId,
      name: selectedProject.name,
      projectId: selectedProject.projectId,
      startDate: selectedProject.startDate,
      status: selectedProject.status,
      jobId: selectedProject.jobId || '',
      jobCode: selectedProject.jobCode || '',
      workTimePerDay: selectedProject.workTimePerDay || '',
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
      psaGroupId: selectedGroup.id,
    };
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

    dispatch(saveProject(project, companyId, selectedGroup.id));
  };

  const Actions = bindActionCreators(
    {
      catchBusinessError,
      editProjectMode: modeActions.editProject,
      onClickDeleteProject: openDeleteProjectDialog,
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
            activeDialog={activeDialog}
            activityList={activityList}
            backToProjectList={onClickBackToProjectList}
            calendarListOption={calendarListOption}
            companyId={companyId}
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
            selectedGroupId={selectedGroup.id}
          />
        );
      }}
    </Formik>
  );
};

export default ProjectDetailFormContainer;
