import React, { useEffect, useState } from 'react';

import moment from 'moment';

import AmountField from '@apps/commons/components/fields/AmountField';
import Combobox from '@apps/commons/components/fields/Combobox';
import TextField from '@apps/commons/components/fields/TextField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import FormField from '@apps/commons/components/psa/FormField';
import PsaAutoSuggestTextField from '@apps/commons/components/psa/PsaAutoSuggestTextField';
import SkillSelectionField from '@apps/commons/components/psa/SkillSelectionField';
import msg from '@apps/commons/languages/index';
import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { ResourceSelectionFilterState } from '@apps/domain/models/psa/Request';

import { SITE_ROUTE_TYPES } from '@apps/psa-pc/modules/ui/siteRoute';

import ResourceGroupFilter from '../ResourceGroupFilter';

import './index.scss';

type Props = {
  deptSuggestList: Array<any>;
  doRefresh?: number;
  enabledFilters?: any;
  filterResults: ResourceSelectionFilterState;
  getGroupMembers: (arg0: string) => void;
  groupDetail: any;
  groupList: Array<any>;
  isResetted: boolean;
  jobGradeOptions: Array<any>;
  minDate?: string;
  maxDate?: string;
  resourceGroups: Array<any>;
  siteRoute: string;
  enDash: string;
  skillCategories: Array<any>;
  updateFilter: (arg0: string, arg1: any) => void;
};

const ROOT = 'ts-psa__common-filter__content';

const FilterContent = (props: Props) => {
  const { enabledFilters } = props;
  const [isJobGradeComboBoxDisabled, setIsJobGradeComboBoxDisabled] =
    useState(false);
  const [comboboxClass, setComboboxClass] = useState('');

  const [requiredEffort, setRequiredEffort] = useState(
    +props.filterResults.requiredTime / 60
  );

  const [requiredEffortUnit, setRequiredEffortUnit] = useState('hours');

  const [isSkillsDialogOpen, setSkillsDialogOpen] = useState(false);

  const autoSuggestDepartment = {
    value: 'id',
    label: 'name',
    buildLabel: (item) =>
      `${item.name}${item.code ? ` ${props.enDash} ${item.code}` : ''}`,
    suggestionKey: ['id', 'code', 'name'],
  };

  useEffect(() => {
    if (props.isResetted) {
      setRequiredEffortUnit('hours');
      setRequiredEffort(
        floorToOneDecimal(+props.filterResults.requiredTime / 60)
      );
    }
  }, [props.isResetted]);

  const onSkillSelect = (skillValues: any) => {
    props.updateFilter('skills', skillValues);
  };

  const onJobGradeSelect = (jobGradeValues: any) => {
    const jobGradeIdList = jobGradeValues
      ? jobGradeValues.map((jobGrade) => jobGrade.id)
      : [];
    if (jobGradeIdList.length >= 5) {
      setIsJobGradeComboBoxDisabled(true);
      setComboboxClass(`${ROOT}__combobox-wrapper`);
    } else {
      setIsJobGradeComboBoxDisabled(false);
      setComboboxClass('');
    }

    props.updateFilter('jobGradeIds', jobGradeValues);
  };

  const onResourceGroupSelect = (groupSet: Set<any>) => {
    const groups = Array.from(groupSet);
    props.updateFilter('resourceGroups', groups);
  };

  const onChangeRequiredEffort = (effort: any) => {
    // when empty triggered, set to 0
    effort = effort === '' ? '0' : effort;
    if (effort && !isNaN(effort)) {
      setRequiredEffort(effort);
      if (requiredEffortUnit === 'days') {
        props.updateFilter('requiredTime', Math.ceil(+effort * 24 * 60));
      } else {
        props.updateFilter('requiredTime', Math.ceil(+effort * 60));
      }
    }
  };

  const getDetails = (type: string) => {
    const { groupDetail } = props;
    const result = groupDetail[type];

    return (
      result &&
      result.map((_) => ({
        id: _.employeeId,
        name: _.employeeName,
        title: _.employeeTitle,
        url: _.employeePhotoUrl,
      }))
    );
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__filter-column`}>
        <FormField
          title={msg().Com_Lbl_EmployeeCode}
          testId={`${ROOT}__resource-code`}
        >
          <TextField
            onChange={(e) => props.updateFilter('code', e.target.value)}
            value={props.filterResults.code}
          />
        </FormField>

        <FormField
          title={msg().Com_Lbl_EmployeeName}
          testId={`${ROOT}__resource-name`}
        >
          <TextField
            onChange={(e) => props.updateFilter('name', e.target.value)}
            value={props.filterResults.name}
          />
        </FormField>

        <FormField
          title={msg().Admin_Lbl_JobGrade}
          testId={`${ROOT}__job-grade`}
          tooltip={msg().Psa_Lbl_JobGradeTooltip}
          tooltipPosition="right"
        >
          <div className={`${comboboxClass}`}>
            <Combobox
              data-testid={`${ROOT}__combobox`}
              disabled={isJobGradeComboBoxDisabled}
              options={props.jobGradeOptions}
              onSelect={onJobGradeSelect}
              selection={
                props.filterResults && props.filterResults.jobGradeIds
                  ? props.jobGradeOptions.filter((jobGradeOption) =>
                      props.filterResults.jobGradeIds
                        .map((jobGrade) => jobGrade.id)
                        .includes(jobGradeOption.id)
                    )
                  : []
              }
            />
          </div>
        </FormField>
        <div className={`${ROOT}__filter-column__skill-selection-filter`}>
          <SkillSelectionField
            initialSkillsets={
              props.filterResults &&
              props.filterResults.skills.filter((skill) => !skill.deleted)
            }
            isDialogOpen={isSkillsDialogOpen}
            isResetted={props.isResetted}
            name={msg().Psa_Lbl_AddSkill}
            onSelect={onSkillSelect}
            selectLimit={5}
            setDialogOpen={setSkillsDialogOpen}
            skillCategories={props.skillCategories}
            testid={`${ROOT}__filter-column__skill-selection-filter-field`}
            title={msg().Psa_Lbl_SelectSkill}
          />
        </div>
      </div>
      <div className={`${ROOT}__filter-column`}>
        <FormField title={msg().Psa_Lbl_JobTitle} testId={`${ROOT}__job-title`}>
          <TextField
            onChange={(e) => props.updateFilter('position', e.target.value)}
            value={props.filterResults.position}
          />
        </FormField>
        <FormField
          title={msg().Admin_Lbl_Department}
          testId={`${ROOT}__department-name`}
        >
          <PsaAutoSuggestTextField
            onChange={(value) => {
              const lastIndex = value.indexOf(props.enDash);
              let deptName = value;
              if (value.split(props.enDash).length > 1) {
                deptName = value.substring(0, lastIndex);
              }
              props.updateFilter('departmentName', deptName.trim());
            }}
            placeholder={
              props.siteRoute === SITE_ROUTE_TYPES.VIEW_ALL_RESOURCES
                ? msg().Psa_Lbl_SearchDepartment
                : msg().Psa_Lbl_SearchProjectDepartment
            }
            suggestConfig={autoSuggestDepartment}
            suggestList={props.deptSuggestList}
            value={props.filterResults.departmentName}
          />
        </FormField>
        <div className={`${ROOT}__filter-column__resource-group-filter`}>
          <ResourceGroupFilter
            name={msg().Psa_Lbl_AddResourceGroup}
            title={msg().Psa_Lbl_SelectResourceGroup}
            groupList={props.groupList}
            isResetted={props.isResetted}
            resourceGroups={
              props.filterResults && props.filterResults.resourceGroups
            }
            selectLimit={5}
            groupDetail={{
              owners: getDetails('owners'),
              members: getDetails('members'),
            }}
            getMembers={props.getGroupMembers}
            onSelect={onResourceGroupSelect}
          />
        </div>
      </div>
      <div className={`${ROOT}__filter-column`}>
        {enabledFilters && enabledFilters.requiredHours && (
          <FormField
            className={`${ROOT}__effort-input`}
            testId={`${ROOT}__effort`}
            title={msg().Psa_Lbl_MinimumRequiredEffort}
          >
            <div className={`${ROOT}__effort-input-container`}>
              <AmountField
                className="ts-text-field slds-input"
                value={requiredEffort}
                fractionDigits={1}
                onChange={onChangeRequiredEffort}
              />
              <TextField
                disabled
                className={`${ROOT}__effort-dropdown`}
                value={msg().Psa_Lbl_Hours}
              />
            </div>
          </FormField>
        )}
        {enabledFilters && enabledFilters.startDate && (
          <FormField title={`StartDate`} testId={`${ROOT}__startDate`}>
            <PsaDateField
              enableValidation
              maxDate={moment(props.maxDate)}
              minDate={moment(props.minDate)}
              onChange={(e) => props.updateFilter('startDate', e)}
              value={props.filterResults.startDate}
              isResetted={props.isResetted}
              doRefresh={props.doRefresh}
            />
            {props.filterResults.endDate &&
              props.filterResults.startDate &&
              !moment(props.filterResults.endDate).isAfter(
                moment(props.filterResults.startDate)
              ) && (
                <span className={`${ROOT}__error`}>
                  {msg().Psa_Err_DateNotValid}
                </span>
              )}
            {moment(props.minDate).isAfter(
              moment(props.filterResults.startDate)
            ) &&
              props.siteRoute === SITE_ROUTE_TYPES.RESOURCE_PLANNER && (
                <span className={`${ROOT}__error`}>
                  {msg().Psa_Err_FilterDurationOutsideActivity}
                </span>
              )}
            {moment(props.minDate).isAfter(
              moment(props.filterResults.startDate)
            ) &&
              props.siteRoute === SITE_ROUTE_TYPES.VIEW_ALL_RESOURCES && ( // both for psa-pc and resource-pc
                <span className={`${ROOT}__error`}>
                  {msg().Psa_Err_FilterDurationOutsideRange}
                </span>
              )}
          </FormField>
        )}
        {enabledFilters && enabledFilters.endDate && (
          <FormField title={`End Date`} testId={`${ROOT}__endDate`}>
            <PsaDateField
              enableValidation
              maxDate={moment(props.maxDate)}
              minDate={moment(props.minDate)}
              onChange={(e) => props.updateFilter('endDate', e)}
              value={props.filterResults.endDate}
              isResetted={props.isResetted}
              doRefresh={props.doRefresh}
            />

            {moment(props.maxDate).isBefore(
              moment(props.filterResults.endDate)
            ) &&
              props.siteRoute === SITE_ROUTE_TYPES.RESOURCE_PLANNER && (
                <span className={`${ROOT}__error`}>
                  {msg().Psa_Err_FilterDurationOutsideActivity}
                </span>
              )}
            {moment(props.maxDate).isBefore(
              moment(props.filterResults.endDate)
            ) &&
              props.siteRoute === SITE_ROUTE_TYPES.VIEW_ALL_RESOURCES && ( // both for psa-pc and resource-pc
                <span className={`${ROOT}__error`}>
                  {msg().Psa_Err_FilterDurationOutsideRange}
                </span>
              )}
          </FormField>
        )}
      </div>
    </div>
  );
};

export default FilterContent;
