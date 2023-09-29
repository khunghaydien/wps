import React, { useEffect, useState } from 'react';

import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import {
  initialResourceSelectionFilterState,
  ResourceSelectionFilterState,
} from '../../../../domain/models/psa/Request';

import msg from '../../../languages/index';
import Filter from '../Filter/index';
import RoleDetailsHeaderInfo from '../RoleDetailsHeaderInfo';
import { sortSkillByRequired } from '../SkillSelectionField/SkillNameHelper';
import FilterContent from './FilterContent';

import './index.scss';

const ROOT = 'ts-psa__resource-planner__filter-info';

type Props = {
  applyFilter: (nextState: ResourceSelectionFilterState) => void;
  /* eslint-enable react/no-unused-prop-types */
  currencyCode?: string;
  deptSuggestList?: Array<any>;
  enabledFilters: any;
  /* eslint-disable react/no-unused-prop-types */
  disableDateRangeError?: boolean;
  filterResultsLabel?: Record<string, any>;
  getGroupMembers: (arg0: string) => void;
  groupDetail: any;
  groupList: Array<any>;
  initialFilterState: ResourceSelectionFilterState;
  jobGradeOptions: Array<any>;
  minDate?: string;
  maxDate?: string;
  resourceSelectionFilterState: ResourceSelectionFilterState;
  selectedRole: any;
  siteRoute: string;
  showFilter: boolean;
  skillCategories: Array<any>;
};

const ResourcePlannerFilterInfo = (props: Props) => {
  const [filterDisplay, setFilterDisplay] = useState(
    initialResourceSelectionFilterState
  );
  const enDash = '–';

  const { resourceGroups, requiredTime, skills, jobGradeIds } =
    props.resourceSelectionFilterState;
  useEffect(() => {
    const jobGradeListValue =
      jobGradeIds && jobGradeIds.map((jobGrade) => jobGrade.label).join(', ');
    const updatedFilterDisplay = {
      ...props.resourceSelectionFilterState,
      requiredTime:
        requiredTime > 0
          ? `${floorToOneDecimal(+requiredTime / 60)} ${msg().Psa_Lbl_Hours}`
          : '',
      skills: skills.sort(sortSkillByRequired),
      jobGradeIds: jobGradeListValue,
      resourceGroups:
        resourceGroups && resourceGroups.map((group) => group.name).join(', '),
    };
    setFilterDisplay(updatedFilterDisplay);
  }, [props.resourceSelectionFilterState]);

  return (
    <div className={ROOT}>
      {props.selectedRole && (
        <RoleDetailsHeaderInfo
          selectedRole={props.selectedRole}
          currencyCode={props.currencyCode ? props.currencyCode : ''}
        />
      )}
      <div className={`${ROOT}__second-row`}>
        {props.showFilter && (
          <Filter
            deptSuggestList={props.deptSuggestList}
            displayState={filterDisplay}
            enabledFilters={props.enabledFilters}
            filterResultsLabel={props.filterResultsLabel}
            initialFilterState={props.initialFilterState}
            maxSelectableDate={props.maxDate}
            minSelectableDate={props.minDate}
            reduxState={props.resourceSelectionFilterState}
            updateReduxState={props.applyFilter}
          >
            {(
              filterResults,
              updateFilter,
              isResetted,
              updateFilterObj,
              doRefresh
            ) => (
              <FilterContent
                enDash={enDash}
                deptSuggestList={props.deptSuggestList}
                enabledFilters={props.enabledFilters}
                filterResults={filterResults}
                getGroupMembers={props.getGroupMembers}
                groupDetail={props.groupDetail}
                groupList={props.groupList}
                isResetted={isResetted}
                jobGradeOptions={props.jobGradeOptions}
                maxDate={props.maxDate}
                minDate={props.minDate}
                resourceGroups={resourceGroups}
                siteRoute={props.siteRoute}
                skillCategories={props.skillCategories}
                updateFilter={updateFilter}
                doRefresh={doRefresh}
              />
            )}
          </Filter>
        )}
      </div>
    </div>
  );
};

export default ResourcePlannerFilterInfo;
