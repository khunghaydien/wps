import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

import newRoleFormSchema from '@psa/schema/NewRoleForm';

import DateUtil from '@apps/commons/utils/DateUtil';

import CurrentRoute from '@apps/domain/models/psa/CurrentRoute';

import { State } from '@psa/modules';

import { listCategory } from '@apps/admin-pc/actions/category';
import { getWorkingDays, hideDialog } from '@psa/action-dispatchers/PSA';
import { getExtendedItemList } from '@psa/action-dispatchers/PsaExtendedItem';
import getResourcegroups from '@psa/action-dispatchers/ResourceGroup';
import { saveRole } from '@psa/action-dispatchers/Role';
import { getGroupMembers } from '@resource/action-dispatchers/ResourceGroup';

import { getJobGradeList } from '@apps/admin-pc/containers/JobGradeContainer';

import NewRoleForm from '@apps/psa-pc/components/Dialog/NewRoleForm';

type OwnProps = {
  isEverythingElseDisabled?: boolean;
  isRoleDetail?: boolean;
};

const NewRoleFormContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const currencyCode = useSelector(
    (state: State) => state.userSetting.currencyCode
  );
  const currencyDecimalPlaces = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const currentRoute = useSelector((state: State) => state.ui.tab);
  const extendedItemConfigList = useSelector(
    (state: State) => state.entities.psa.psaExtendedItem.role
  );
  const groupDetail = useSelector(
    (state: State) => state.entities.psa.resourceGroup.detail
  );
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const jobGradeList = useSelector((state: State) => getJobGradeList(state));
  const resourceGroupList = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const resourceGroups = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );
  const skillCategories = useSelector(
    (state: State) => state.entities.skillsetCategoryList
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );

  useEffect(() => {
    dispatch(getResourcegroups(companyId, selectedGroup.id));
    dispatch(getExtendedItemList(companyId, 'Role'));
    dispatch(listCategory({ companyId }));
  }, []);

  const getCompanyWorkingDays = (startDate, endDate) =>
    dispatch(getWorkingDays(selectedProject.projectId, startDate, endDate))
      // @ts-ignore
      .then((res) => res);

  const generateInitialValues = () => {
    const isEditingRole = selectedRole.roleId !== '';

    const activityStartDate = moment(selectedActivity.plannedStartDate);
    const today = moment();
    let plannedStartDate = '';
    if (today > activityStartDate) {
      plannedStartDate = DateUtil.format(today, 'YYYY-MM-DD');
    } else {
      plannedStartDate = DateUtil.format(
        selectedActivity.plannedStartDate,
        'YYYY-MM-DD'
      );
    }
    const plannedEndDate = DateUtil.format(
      selectedActivity.plannedEndDate,
      'YYYY-MM-DD'
    );

    if (isEditingRole) {
      const editingExtendedItems = {};
      selectedRole.extendedItems &&
        selectedRole.extendedItems.length > 0 &&
        selectedRole.extendedItems.forEach((x) => {
          editingExtendedItems[x.id] = x.value ? x.value : '';
        });

      return {
        roleId: selectedRole.roleId,
        roleTitle: selectedRole.roleTitle,
        skills: selectedRole.skills
          ? selectedRole.skills.map((s) => ({
              ...s,
              rating: [s.min, s.max],
            }))
          : [],
        groupId: selectedRole.groupId,
        jobGrades: selectedRole.jobGrades,
        startDate: selectedRole.startDate,
        endDate: selectedRole.endDate,
        assignmentDueDate: selectedRole.assignmentDueDate,
        requiredTime: selectedRole.requiredTime,
        requiredTimePercentage: selectedRole.requiredTimePercentage,
        remarks: selectedRole.remarks ? selectedRole.remarks : '',
        extendedItemValueId: selectedRole.extendedItemValueId,
        ...editingExtendedItems,
        extendedItemConfigList: extendedItemConfigList || [],
      };
    }

    // Transform the object such that id to serve as unique identifier for formik validation
    const transformedExtendeditems = {};
    extendedItemConfigList &&
      extendedItemConfigList.length > 0 &&
      extendedItemConfigList.forEach((x) => {
        transformedExtendeditems[x.id] = x.defaultValueText;
      });
    return {
      roleTitle: '',
      skills: [],
      jobGrades: [],
      billRate: 0,
      costRate: 0,
      groupId: selectedProject.groupId,
      startDate: plannedStartDate,
      endDate: plannedEndDate,
      assignmentDueDate: plannedStartDate,
      requiredTime: 0,
      remarks: '',
      ...transformedExtendeditems,
      extendedItemConfigList: extendedItemConfigList || [],
    };
  };

  const handleSubmit = (values) => {
    const role: any = cloneDeep(values);
    const extendedItems = [];
    if (extendedItemConfigList && extendedItemConfigList.length > 0) {
      extendedItemConfigList.forEach((eI) => {
        extendedItems.push({
          id: eI.id,
          value: values[eI.id],
          name: eI.name,
        });
        delete role[eI.id];
      });
      role.companyId = companyId;
    }
    delete role.extendedItemConfigList;
    role.extendedItems = extendedItems;
    if (!role.activityId) {
      role.activityId = selectedActivity.activityId;
    }

    const isEditingRole = selectedRole.roleId !== '';

    if (isEditingRole) {
      selectedRole.extendedItemValueId &&
      selectedRole.extendedItemValueId !== ''
        ? (role.extendedItemValueId = selectedRole.extendedItemValueId)
        : (role.extendedItemValueId = '');
    }
    if (currentRoute === CurrentRoute.Projects) {
      role.saveBy = 'PM';
    } else if (currentRoute === CurrentRoute.Resource) {
      role.saveBy = 'RM';
    }
    role.requiredTime = Math.round(role.requiredTime);
    dispatch(saveRole(role, selectedProject.projectId, jobGradeList));
  };

  const Actions = bindActionCreators(
    {
      getWorkingDays,
      hideDialog,
      getGroupMembers,
      saveRole,
    },
    dispatch
  );

  return (
    <Formik
      enableReinitialize
      initialValues={generateInitialValues()}
      validationSchema={newRoleFormSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <NewRoleForm
            currencyCode={currencyCode}
            currencyDecimalPlaces={currencyDecimalPlaces}
            currentRoute={currentRoute}
            errors={props.errors}
            extendedItemConfigList={extendedItemConfigList}
            getWorkingDays={getCompanyWorkingDays}
            getGroupMembers={Actions.getGroupMembers}
            groupDetail={groupDetail}
            handleSubmit={props.handleSubmit}
            hideDialog={Actions.hideDialog}
            isLoading={isLoading}
            isRoleDetail={ownProps.isRoleDetail}
            jobGradeList={jobGradeList}
            resourceGroupList={resourceGroupList}
            resourceGroups={resourceGroups}
            selectedActivity={selectedActivity}
            selectedProject={selectedProject}
            selectedRole={selectedRole}
            skillCategories={skillCategories}
            setFieldTouched={props.setFieldTouched}
            setFieldValue={props.setFieldValue}
            touched={props.touched}
            validateForm={props.validateForm}
            values={props.values}
          />
        );
      }}
    </Formik>
  );
};

export default NewRoleFormContainer;
