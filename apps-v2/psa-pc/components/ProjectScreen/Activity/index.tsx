import React, { useEffect, useState } from 'react';

import last from 'lodash/last';

import Button from '@apps/commons/components/buttons/Button';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import CapabilityInfoContainer from '@apps/commons/containers/psa/CapabilityInfoContainer';
import EmptyScreenContainer from '@apps/commons/containers/psa/EmptyScreenContainer';
import RefreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages';

import { ActivityList } from '@apps/domain/models/psa/Activity';
import { Project, PROJECT_STATUS } from '@apps/domain/models/psa/Project';

import { dialogTypes } from '@psa/modules/ui/dialog/activeDialog';

import ActivityDetailFormContainer from '@psa/containers/ActivityDetailFormContainer';
import NewActivityFormContainer from '@psa/containers/NewActivityFormContainer';
import NewRoleFormContainer from '@psa/containers/NewRoleFormContainer';

import ActivityHeader from './ActivityList/Header';
import ActivityItem from './ActivityList/Item';

import './index.scss';

export const ROOT = 'ts-psa__activity';

type Props = {
  activeDialog: Array<string>;
  activityList: ActivityList;
  clearRoleLocally: () => void;
  editActivity: (activityId: string) => void;
  getActivityList: () => void;
  getJobGradeList: () => void;
  getRole: (roleId: string, activityId: string) => void;
  isLoading: boolean;
  openEmployeeCapabilityInfo: (empId: string) => void;
  openNewActivityDialog: () => void;
  openNewRoleDialog: () => void;
  selectedProject: Project;
  setActivityEndDate: (activityEndDate: string) => void;
  setActivityId: (activityId: string) => void;
  setActivityStartDate: (activityStartDate: string) => void;
  setActivityTitle: (activityTitle: string) => void;
  enableProgressCheck: boolean;
};

const Activity = (props: Props) => {
  const { activityList, selectedProject } = props;
  const allCollapsedState = Array.from(activityList, (_) => false);
  const hasActivity = activityList.length > 0;
  const isCapabilityInfoDialogActive =
    last(props.activeDialog) === dialogTypes.EMPLOYEE_CAPABILITY_INFO;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isExpandedAll, setExpandedAllState] =
    useState<Array<any>>(allCollapsedState);

  const currentActiveDialog = last(props.activeDialog);
  const isRoleDetail = currentActiveDialog === dialogTypes.ROLE_DETAIL;

  const expandAll = () => {
    const allExpandedState = activityList.map(
      (activity) => activity.roles && activity.roles.length > 0
    );
    setExpandedAllState(allExpandedState);
  };
  const collapseAll = () => setExpandedAllState(allCollapsedState);
  const toggleExpandedState = (i) => () => {
    // if initial state is empty array, init from allCollapsedState
    const isExpandedAllCopy =
      isExpandedAll.length === 0 ? [...allCollapsedState] : [...isExpandedAll];
    isExpandedAllCopy.splice(i, 1, !isExpandedAllCopy[i]);
    setExpandedAllState(isExpandedAllCopy);
  };

  useEffect(() => {
    props.getActivityList();
    props.getJobGradeList();
  }, []);

  useEffect(() => {
    expandAll();
  }, [props.activityList]);

  // return empty if there's no activity
  if (!activityList) {
    return null;
  }

  const isNewActivityDisabled =
    selectedProject.status === PROJECT_STATUS.Cancelled ||
    selectedProject.status === PROJECT_STATUS.Completed;

  const renderActiveDialog = () => {
    let dialog = null;

    if (currentActiveDialog === dialogTypes.NEW_ACTIVITY) {
      dialog = <NewActivityFormContainer />;
    } else if (currentActiveDialog === dialogTypes.ACTIVITY_DETAIL) {
      dialog = <ActivityDetailFormContainer />;
    } else if (currentActiveDialog === dialogTypes.NEW_ROLE) {
      dialog = <NewRoleFormContainer />;
    } else if (isRoleDetail) {
      dialog = <NewRoleFormContainer isRoleDetail={isRoleDetail} />;
    }

    return dialog;
  };

  // if there's no activity, show empty placeholder
  let activityContent = (
    <div className={`${ROOT}__content`}>
      <EmptyScreenContainer
        headerMessage={msg().Psa_Lbl_EmptyActivityHeader}
        bodyMessage={msg().Psa_Lbl_EmptyActivityBody}
      />
    </div>
  );

  if (activityList.length > 0) {
    activityContent = (
      <div className={`${ROOT}__content`}>
        <ActivityHeader
          expandAll={expandAll}
          collapseAll={collapseAll}
          isDisabled={!hasActivity}
        />
        {activityList.map((i, index) => (
          <ActivityItem
            key={i.activityId}
            activityId={i.activityId}
            clearRoleLocally={props.clearRoleLocally}
            editActivity={props.editActivity}
            getRole={props.getRole}
            isExpanded={isExpandedAll[index]}
            leadName={i.leadName}
            leadPhotoUrl={i.leadPhotoUrl}
            openEmployeeCapabilityInfo={props.openEmployeeCapabilityInfo}
            openNewRoleDialog={props.openNewRoleDialog}
            plannedEndDate={i.plannedEndDate}
            plannedStartDate={i.plannedStartDate}
            roles={i.roles}
            setActivityEndDate={props.setActivityEndDate}
            setActivityId={props.setActivityId}
            setActivityStartDate={props.setActivityStartDate}
            setActivityTitle={props.setActivityTitle}
            status={i.status}
            title={i.title}
            toggleExpand={toggleExpandedState(index)}
            riskStatus={i.riskStatus}
            progressComment={i.progressComment}
            progressLevel={i.progressLevel}
            progressDate={i.progressDate}
            enableProgressCheck={props.enableProgressCheck}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${ROOT}`}>
      {isCapabilityInfoDialogActive && <CapabilityInfoContainer />}
      <PSACommonHeader title={msg().Psa_Lbl_Activities}>
        <Button
          className={`${ROOT}__refresh-btn`}
          data-testid={`${ROOT}__refresh-btn`}
          onClick={() => props.getActivityList()}
        >
          <RefreshIcon />
        </Button>
        <Button
          type="primary"
          disabled={isNewActivityDisabled}
          className={`${ROOT}__btn--new`}
          onClick={props.openNewActivityDialog}
        >
          {msg().Psa_Lbl_ActivityNew}
        </Button>
      </PSACommonHeader>

      {!props.isLoading && activityContent}
      {renderActiveDialog()}
    </div>
  );
};

export default Activity;
