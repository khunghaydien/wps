import React from 'react';

import last from 'lodash/last';

import Button from '@apps/commons/components/buttons/Button';
import SelectField from '@apps/commons/components/fields/SelectField';
import Filter from '@apps/commons/components/psa/Filter';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import ROOT from '@apps/commons/components/psa/ParentHeader';
import CapabilityInfoContainer from '@apps/commons/containers/psa/CapabilityInfoContainer';
import RefreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import {
  makeInitialRequestListFilterState,
  RoleRequestListFilterState,
} from '@apps/domain/models/psa/Request';
import { ResourceListItem } from '@apps/domain/models/psa/Resource';

import { dialogTypes } from '@apps/resource-pc/modules/ui/dialog/activeDialog';
import { modes } from '@resource/modules/ui/mode';

import FilterContent from './FilterContent';

import './index.scss';

type Props = {
  activeDialog: Array<string>;
  applyFilter: (nextState: RoleRequestListFilterState) => void;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  companyId: string;
  currencyCode: string;
  deptSuggestList: Array<any>;
  employeeName: string;
  jobGrades: Array<any>;
  mode: string;
  openEmployeeCapabilityInfo?: (empId: string) => void;
  requestSelectionFilterState: RoleRequestListFilterState;
  roleRequestFilterState: RoleRequestListFilterState;
  selectedResource?: ResourceListItem;
  updateRoleRequestFilter: (nextState: RoleRequestListFilterState) => void;
  viewAllResources: () => void;
  getGroupMembers: (arg0: string) => void;
  groupDetail: any;
  groupList: Array<any>;
  updateSelectedGroup: (selectedGroupId: string) => void;
  psaGroupList: Array<any>;
  selectedGroup: any;
};

const getFilterResultsLabel = () => ({
  assignmentDueDate: msg().Psa_Lbl_AssignmentDueDate,
  clientName: msg().Psa_Lbl_ProjectClientName,
  deptId: msg().Psa_Lbl_ProjectDepartment,
  jobGradeIds: msg().Admin_Lbl_JobGrade,
  pmName: msg().Psa_Lbl_ProjectManager,
  pmCode: msg().Psa_Lbl_ProjectManagerCode,
  projectCode: msg().Psa_Lbl_ProjectCode,
  projectTitle: msg().Psa_Lbl_ProjectTitle,
  receivedDate: msg().Psa_Lbl_ReceivedDate,
  requestCode: msg().Psa_Lbl_RequestCode,
  requesterCode: msg().Psa_Lbl_RequesterCode,
  requesterName: msg().Psa_Lbl_RequestedBy,
  resourceGroup: msg().Psa_Lbl_ResourceGroup,
  rmName: msg().Psa_Lbl_ResourceManager,
  roleStartDate: msg().Psa_Lbl_StartDate,
  roleTitle: msg().Psa_Lbl_ProjectRoleTitle,
  statusList: msg().Psa_Lbl_Status,
});

const Header = (props: Props) => {
  const initialFilterState = makeInitialRequestListFilterState(
    props.employeeName
  );

  const groupListOptions =
    props.psaGroupList &&
    props.psaGroupList.map((data) => {
      return {
        value: data.id,
        text: data.name,
      };
    });

  const isCapabilityInfoDialogActive =
    last(props.activeDialog) === dialogTypes.EMPLOYEE_CAPABILITY_INFO;
  const filterState =
    props.mode === modes.RESOURCE_ASSIGNMENT
      ? props.requestSelectionFilterState
      : props.roleRequestFilterState;
  const onClickOpenCapabilityInfo = () => {
    if (props.openEmployeeCapabilityInfo && props.selectedResource.id) {
      props.openEmployeeCapabilityInfo(props.selectedResource.id);
    }
  };

  return (
    <div className={ROOT}>
      {isCapabilityInfoDialogActive && <CapabilityInfoContainer />}
      <div className={`${ROOT}__first-row`}>
        <div className={`${ROOT}--left`}>
          {props.mode && props.mode === modes.RESOURCE_ASSIGNMENT ? (
            <div className={`${ROOT}--left__reduce-margin`}>
              <PSACommonHeader
                title={TextUtil.template(
                  msg().Psa_Lbl_SelectRequest,
                  props.selectedResource.name
                )}
              ></PSACommonHeader>
            </div>
          ) : (
            <span className={`${ROOT}-title`}>
              {msg().Psa_Lbl_ResourceRequests}
            </span>
          )}
        </div>
        {props.mode && props.mode === modes.RESOURCE_ASSIGNMENT ? (
          <div className={`${ROOT}--right`}>
            <div
              className={`${ROOT}__selected-resource`}
              data-testid={`${ROOT}__selected-resource`}
            >
              <div className={`${ROOT}__selected-resource-label`}>
                <p>{msg().Psa_Lbl_SelectedResource}:</p>
              </div>
              <span className={`${ROOT}__selected-resource-photo`}>
                <img
                  onClick={onClickOpenCapabilityInfo}
                  src={props.selectedResource.photoUrl}
                />
                <div className={`${ROOT}__selected-resource-name`}>
                  <a onClick={onClickOpenCapabilityInfo}>
                    {props.selectedResource.name}
                  </a>
                </div>
              </span>
            </div>
            <Button
              className={`${ROOT}__refresh-btn`}
              data-testid={`${ROOT}__refresh-btn`}
              onClick={() => props.applyFilter(filterState)}
            >
              <RefreshIcon />
            </Button>
          </div>
        ) : (
          <div className={`${ROOT}--right`}>
            {groupListOptions && groupListOptions.length > 1 && (
              <>
                <div className={`${ROOT}__option-group-label`}>
                  {msg().Psa_Lbl_PSAGroupLabel}
                </div>
                <SelectField
                  className={`${ROOT}__option-group`}
                  onChange={(e) => props.updateSelectedGroup(e.target.value)}
                  value={props.selectedGroup.id}
                  options={groupListOptions}
                />
              </>
            )}
            <Button
              className={`${ROOT}__refresh-btn`}
              data-testid={`${ROOT}__refresh-btn`}
              onClick={() => props.applyFilter(filterState)}
              disabled={props.psaGroupList.length === 0}
            >
              <RefreshIcon />
            </Button>
            <Button
              type="default"
              className={`${ROOT}__btn-resources`}
              data-testid={`${ROOT}__btn--resources`}
              onClick={props.viewAllResources}
              disabled={props.psaGroupList.length === 0}
            >
              {msg().Psa_Lbl_ViewAllResources}
            </Button>
          </div>
        )}
      </div>
      <div className={`${ROOT}__second-row`}>
        {props.psaGroupList.length > 0 && (
          <Filter
            deptSuggestList={props.deptSuggestList}
            initialFilterState={initialFilterState}
            reduxState={filterState}
            updateReduxState={props.applyFilter}
            filterResultsLabel={getFilterResultsLabel()}
          >
            {(
              filterResults,
              updateFilter,
              isResetted,
              updateFilterObj,
              doRefresh
            ) => (
              <FilterContent
                isDisabled={
                  props.mode && props.mode === modes.RESOURCE_ASSIGNMENT
                }
                deptSuggestList={props.deptSuggestList}
                companyId={props.companyId}
                filterResults={filterResults}
                updateFilter={updateFilter}
                updateFilterObj={updateFilterObj}
                updateReduxState={props.updateRoleRequestFilter}
                jobGrades={props.jobGrades}
                currencyCode={props.currencyCode}
                isResetted={isResetted}
                doRefresh={doRefresh}
                getGroupMembers={props.getGroupMembers}
                groupDetail={props.groupDetail}
                groupList={props.groupList}
                catchBusinessError={props.catchBusinessError}
              />
            )}
          </Filter>
        )}
      </div>
    </div>
  );
};

export default Header;
