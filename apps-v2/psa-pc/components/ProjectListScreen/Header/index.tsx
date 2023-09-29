import React from 'react';

import Button from '@apps/commons/components/buttons/Button';
import Filter from '@apps/commons/components/psa/Filter';
import ROOT from '@apps/commons/components/psa/ParentHeader';
import RefreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages';

import {
  initialProjectListFilterState,
  Project,
  ProjectListFilterState,
} from '@apps/domain/models/psa/Project';

import FilterContent from './FilterContent';

import './index.scss';

type Props = {
  applyFilter: (nextState: ProjectListFilterState) => void;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  companyId: string;
  deptSuggestList: Array<any>;
  employeeFullName: any;
  isOverlapProject: boolean;
  onClickBackToProjectList: () => void;
  openNewProjectDialog: () => void;
  openViewAllResources: () => void;
  projectListFilterState: ProjectListFilterState;
  selectedProject: Project;
  updateProjectListFilter: (nextState: ProjectListFilterState) => void;
};

const getFilterResultsLabel = () => ({
  clientName: msg().Psa_Lbl_ProjectClient,
  deptName: msg().Psa_Lbl_ProjectDepartment,
  projectCode: msg().Psa_Lbl_ProjectCode,
  projectEndDate: msg().Psa_Lbl_EndDate,
  projectManager: msg().Psa_Lbl_ProjectManager,
  projectManagerCode: msg().Psa_Lbl_ProjectManagerCode,
  projectStartDate: msg().Psa_Lbl_StartDate,
  projectTitle: msg().Psa_Lbl_ProjectTitle,
  requester: msg().Psa_Lbl_RequestedBy,
  requesterCode: msg().Psa_Lbl_RequesterCode,
  statusList: msg().Psa_Lbl_Status,
});

const Header = (props: Props) => {
  const enDash = '–';
  return (
    <div className={ROOT}>
      <div className={`${ROOT}__first-row`}>
        <div className={`${ROOT}--left`}>
          {props.isOverlapProject ? (
            <div className={`${ROOT}-project`}>
              <p className={`${ROOT}-project-label`}>
                {msg().Psa_Lbl_ProjectTitle}
              </p>
              <p className={`${ROOT}-project-title`}>
                {props.selectedProject.name}
              </p>
            </div>
          ) : (
            <h1 className={`${ROOT}-title`}>{msg().Psa_Lbl_ProjectList}</h1>
          )}
        </div>
        <div className={`${ROOT}--right`}>
          <Button
            type="default"
            className={`${ROOT}__btn-resources`}
            data-testid={`${ROOT}__btn--resources`}
            onClick={props.openViewAllResources}
          >
            {msg().Psa_Lbl_ViewAllResources}
          </Button>
          <Button
            className={`${ROOT}__refresh-btn`}
            data-testid={`${ROOT}__refresh-btn`}
            onClick={() => props.applyFilter(props.projectListFilterState)}
          >
            <RefreshIcon />
          </Button>

          {props.isOverlapProject ? (
            <a
              href="#"
              id={`${ROOT}__back-to-project`}
              onClick={props.onClickBackToProjectList}
            >
              {msg().Psa_Lbl_BackToProjectList}
            </a>
          ) : (
            <Button
              className={`${ROOT}-btn`}
              type="primary"
              data-testid={`${ROOT}__new-project`}
              onClick={props.openNewProjectDialog}
            >
              {msg().Psa_Lbl_NewProject}
            </Button>
          )}
        </div>
      </div>
      <div className={`${ROOT}__second-row`}>
        <Filter
          deptSuggestList={props.deptSuggestList}
          filterResultsLabel={getFilterResultsLabel()}
          initialFilterState={initialProjectListFilterState(
            props.employeeFullName
          )}
          reduxState={props.projectListFilterState}
          shouldChangeWhenInitialStateChanges
          updateReduxState={props.applyFilter}
        >
          {(filterResults, updateFilter, _, updateFilterObj, doRefesh) => (
            <FilterContent
              catchBusinessError={props.catchBusinessError}
              companyId={props.companyId}
              deptSuggestList={props.deptSuggestList}
              filterResults={filterResults}
              updateFilter={updateFilter}
              updateFilterObj={updateFilterObj}
              updateReduxState={props.updateProjectListFilter}
              isResetted={_}
              doRefresh={doRefesh}
              enDash={enDash}
            />
          )}
        </Filter>
      </div>
    </div>
  );
};

export default Header;
