import React, { useEffect, useState } from 'react';

import SelectField from '@apps/commons/components/fields/SelectField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import ResourceGroup from '@apps/commons/components/psa/FilterInfo/ResourceGroupFilter';
import FormField from '@apps/commons/components/psa/FormField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';

import { Employee } from '@apps/domain/models/organization/Employee';
import { CategoryType } from '@apps/domain/models/psa/ExtendedItem';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';

import AutoSuggestTextField from '@apps/admin-pc/components/AutoSuggestTextField';
import { Props as CreateProps } from '@psa/components/Dialog/NewProjectForm/index';
import { Props } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import './index.scss';

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__operation`;

export const autoSuggest = {
  value: 'id',
  label: 'name',
  buildLabel: (item) => `${item.name}${item.code ? ` - ${item.code}` : ''}`,
  suggestionKey: ['id', 'code', 'name'],
};

const processedManagerListOption = (employeeList: Array<Employee>) => {
  return employeeList.map((emp) => ({
    id: emp.id,
    code: emp.code,
    name: emp.name,
    displayName: `${emp.name} - ${emp.code}`,
  }));
};
const Operation = (props: Props | CreateProps) => {
  // @ts-ignore
  const { refArray, values, errors, touched } = props;
  const [pmSuggestList, setPmSuggestList] = useState(
    processedManagerListOption(props.managerListOption)
  );
  const [selectedResourceGroup, setSelectedResourceGroup] = useState(null);
  useEffect(() => {
    props.setFieldValue(
      'pmBaseId',
      props.createProject
        ? props.values.pmBaseId
        : // @ts-ignore
          props.selectedProject.pmBaseId
    );
  }, []);

  useEffect(() => {
    setSelectedResourceGroup(
      props.resourceGroupList?.filter((e) => e.id === props.values.groupId)
    );
  }, [props, props.resourceGroupList]);

  const isPermissionRead = props.permission === 'Read' && !props.createProject;

  const isEverythingElseDisabled =
    values.status !== 'Planning' && values.status !== 'InProgress';

  const onProjectManagerChange = (eventObj) => {
    if (eventObj) {
      // update the suggestion list
      setPmSuggestList([eventObj]);

      // update the project manager Id
      props.setFieldValue('pmBaseId', eventObj.id);

      // update the selected project manager Id locally
      props.saveProjectManagerLocally(eventObj.id);
    }
  };

  const onProjectManagerBlur = (value) => {
    if (value === '') {
      setPmSuggestList([]);
      props.setFieldValue('pmBaseId', '');
      props.saveProjectManagerLocally('');
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

  // Extended items
  const [renderedExtendedItem, setRenderedExtendedItem] = useState(<div></div>);
  const formFieldGenerator = (extendedItem: PsaExtendedItem) => {
    let result;
    switch (extendedItem.inputType) {
      case 'Text':
        result = (
          <input
            disabled={extendedItem.readOnly || isPermissionRead}
            className="ts-text-field slds-input"
            type="text"
            onChange={(e) => {
              props.setFieldValue(`${extendedItem.id}`, e.target.value);
            }}
            value={values[extendedItem.id]}
          />
        );
        break;
      case 'Date':
        result = (
          <PsaDateField
            disabled={extendedItem.readOnly || isPermissionRead}
            placeholder={msg().Admin_Lbl_ExtendedItemDate}
            value={DateUtil.format(values[extendedItem.id], 'YYYY-MM-DD')}
            onChange={(eiDate) => {
              props.setFieldValue(`${extendedItem.id}`, eiDate);
            }}
          />
        );
        break;
      case 'Picklist':
        result = (
          <SelectField
            disabled={extendedItem.readOnly || isPermissionRead}
            className={`${ROOT}__ei-select`}
            options={
              extendedItem.picklistValue &&
              generatePicklistOptions(
                extendedItem.picklistLabel,
                extendedItem.picklistValue
                  .split('\\n')
                  .map((e) => e.trim())
                  .join('\\n')
              )
            }
            onChange={(e) => {
              props.setFieldValue(`${extendedItem.id}`, e.target.value);
            }}
            value={values[extendedItem.id]}
          />
        );
        break;
    }
    return result;
  };

  useEffect(() => {
    if (
      props.extendedItemConfigList &&
      props.extendedItemConfigList.length > 0
    ) {
      const extendedItems = (
        <div className={`${ROOT}__extended-item-container`}>
          {props.extendedItemConfigList &&
            props.extendedItemConfigList.map(
              (eItem) =>
                eItem.enabled &&
                eItem.categoryType === CategoryType.ProjectOperation && (
                  <FormField
                    title={eItem.name}
                    testId={`${ROOT}__eI`}
                    isRequired={eItem.required}
                    error={errors[eItem.id]}
                    errorTextClassName={`${ROOT}__errText`}
                    isTouched={touched[eItem.id]}
                    tooltip={eItem.description}
                  >
                    {formFieldGenerator(eItem)}
                  </FormField>
                )
            )}
        </div>
      );
      setRenderedExtendedItem(extendedItems);
    }
  }, [props.extendedItemConfigList, values, touched, errors]);
  // end of Extended items
  return (
    <>
      <div className={`${FORM_ROOT}__title`}>{msg().Psa_Lbl_FormOperation}</div>
      <section ref={refArray[1]} className={ROOT}>
        <FormField
          title={msg().Psa_Lbl_ProjectManager}
          isRequired
          error={errors.pmBaseId}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.pmBaseId}
          testId={`${ROOT}__pm`}
          tooltip={props.customHint.projectManager}
        >
          {/* @ts-ignore */}
          <AutoSuggestTextField
            companyId={props.companyId}
            debounceDelay={300}
            loadAsyncSuggestions={props.searchEmployeeList}
            processSuggestList={props.getManagerList}
            onSelectAsyncSuggestion={(eventObj) => {
              onProjectManagerChange(eventObj);
            }}
            onBlurAsyncSuggestion={(value) => {
              onProjectManagerBlur(value);
            }}
            disabled={isEverythingElseDisabled || isPermissionRead}
            onBlur={(e, value) => {
              props.setFieldValue('pmBaseId', value);
            }}
            value={values.pmBaseId}
            suggestList={pmSuggestList}
            suggestConfig={autoSuggest}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ProjectDepartment}
          testId={`${ROOT}__project-department`}
          error={errors.deptId}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.deptId}
          tooltip={props.customHint.projectDepartment}
        >
          {/* @ts-ignore */}
          <AutoSuggestTextField
            onBlur={(e, value) => {
              props.setFieldValue('deptId', value);
            }}
            value={values.deptId}
            disabled={isEverythingElseDisabled || isPermissionRead}
            suggestList={props.deptSuggestList}
            suggestConfig={autoSuggest}
            placeholder={msg().Psa_Lbl_SearchProjectDepartment}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ResourceGroup}
          testId={`${ROOT}__rg`}
          error={errors.groupId}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.groupId}
          tooltip={props.customHint.resourceGroup}
        >
          <ResourceGroup
            getMembers={props.getGroupMembers}
            title={msg().Psa_Lbl_SelectResourceGroup}
            isResetted={true}
            name={msg().Psa_Lbl_SelectResourceGroup}
            groupDetail={{
              owners: getDetails('owners'),
              members: getDetails('members'),
            }}
            groupList={props.resourceGroupList}
            onSelect={(groupSet: Set<any>) => {
              const groups = Array.from(groupSet);
              if (groups.length) {
                props.setFieldValue('groupId', groups[0].id);
                setSelectedResourceGroup(
                  props.resourceGroupList.filter((e) => e.id === groups[0].id)
                );
              }
            }}
            onRemove={() => {
              props.setFieldValue('groupId', '');
            }}
            resourceGroups={selectedResourceGroup}
            selectLimit={1}
            disabled={isEverythingElseDisabled || isPermissionRead}
          />
        </FormField>
        {renderedExtendedItem}
      </section>
    </>
  );
};

export default Operation;
