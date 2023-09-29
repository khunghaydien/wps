import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import IconButton from '@apps/commons/components/buttons/IconButton';
import SelectField from '@apps/commons/components/fields/SelectField';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import TextField from '@apps/commons/components/fields/TextField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import PsaDateRangeField from '@apps/commons/components/psa/Fields/DateRangeField';
import FormField from '@apps/commons/components/psa/FormField';
import SelectionDialog from '@apps/commons/components/psa/SelectionDialog';
import btnSearch from '@apps/commons/images/btnSearchVia.png';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { generatePicklistOptions } from '@apps/commons/utils/psa/ExtendedItemUtil';

// --- Job Selection --- //
import JobRepository from '@apps/repositories/JobRepository';

// --- Job Selection --- //
import { Job as JobMaster } from '@apps/domain/models/organization/Job';
import { CategoryType } from '@apps/domain/models/psa/ExtendedItem';
import { OpportunityDefaultParam } from '@apps/domain/models/psa/Opportunity';
import { PROJECT_STATUS } from '@apps/domain/models/psa/Project';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';

import { AppDispatch } from '@apps/psa-pc/action-dispatchers/AppThunk';
import { getOpportunityList } from '@apps/psa-pc/action-dispatchers/Opportunity';
import { getClientList } from '@psa/action-dispatchers/Client';

import ClearableField from '@apps/admin-pc/components/Common/ClearableField';
import { Props as CreateProps } from '@psa/components/Dialog/NewProjectForm/index';
import { Props } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import { useJobSelectDialog } from '@apps/time-tracking/JobSelectDialog';

import './index.scss';

export const autoSuggest = {
  value: 'id',
  label: 'name',
  buildLabel: (item) => `${item.name}${item.code ? ` - ${item.code}` : ''}`,
  suggestionKey: ['id', 'code', 'name'],
};

const FORM_ROOT = 'ts-psa__project-form';
const ROOT = `${FORM_ROOT}__base`;

const BaseInfo = (props: CreateProps | Props) => {
  // @ts-ignore
  const { errors, values, touched, refArray, companyId, useExistingJobCode } =
    props;

  const [jobCodeTargetDate, setJobCodeTargetDate] = useState(
    DateUtil.getToday()
  );

  const isPermissionRead = props.permission === 'Read' && !props.createProject;
  const isEverythingElseDisabled = values.status !== 'Planning';
  const disableEndDate =
    values.status === 'Completed' || values.status === 'Cancelled';

  const isProjectCancelled =
    !props.createProject &&
    // @ts-ignore
    props.selectedProject &&
    // @ts-ignore
    props.selectedProject.status === 'Cancelled';

  const statusOption = props.createProject
    ? Object.keys(PROJECT_STATUS)
        .filter((key) => key === 'Planning' || key === 'InProgress')
        .map((key) => {
          return {
            value: key,
            text: msg()[`Psa_Lbl_Status${key}`],
            disabled: false,
          };
        })
    : // @ts-ignore
      props.selectedProject &&
      Object.keys(PROJECT_STATUS).map((key) => {
        let isStatusDisabled = null;

        // if current status is In Progress, then allow user to change to Planning option
        // only if there are NO In Progress or Completed Activities
        if (
          // @ts-ignore
          props.selectedProject.status === 'InProgress' &&
          key === 'Planning' &&
          // @ts-ignore
          props.hasInProgressOrCompletedActivity
        ) {
          isStatusDisabled = true;
        }

        // if current status is Cancelled, then do not allow user to select other statuses other than in progress
        // @ts-ignore
        if (
          // @ts-ignore
          isProjectCancelled &&
          key !== 'InProgress'
        ) {
          isStatusDisabled = true;
        }

        // if current status is completed, then only allow in progress
        if (
          // @ts-ignore
          props.selectedProject.status === 'Completed' &&
          key !== 'InProgress'
        ) {
          isStatusDisabled = true;
        }

        return {
          value: key,
          text: msg()[`Psa_Lbl_Status${key}`],
          disabled: isStatusDisabled,
        };
      });
  // --- START Job Selection --- //
  // project end date / job end date
  const targetDate = DateUtil.format(values.startDate, 'YYYY-MM-DD');

  const selectedJobLabel = values.jobId ? values.jobCode : '';

  const [onClickShowDialog] = useJobSelectDialog({
    targetDate: jobCodeTargetDate,
    onOk: ({ id, code, name }: JobMaster) => {
      props.setFieldValue('jobId', id);
      props.setFieldValue('jobCode', `${code} - ${name}`);
    },
    onError: () =>
      props.catchBusinessError(
        msg().Psa_Err_Unexpected,
        msg().Psa_Err_DataExceed,
        ''
      ),
    repository: JobRepository,
    companyId,
    empId: null,
    isTargetDateFieldEnabled: true,
    updateTargetDate: (targetDate) => {
      setJobCodeTargetDate(targetDate);
    },
  });
  // --- END Job Selection --- //
  let initialSelectedClient: any;
  if (!props.createProject) {
    // @ts-ignore
    if (props.clientId && props.clientName) {
      initialSelectedClient = [
        {
          // @ts-ignore
          name: props.clientName,
          // @ts-ignore
          id: props.clientId,
          code: null,
        },
      ];
    }
  }

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedClient, setSelectedClient] = useState(initialSelectedClient);

  useEffect(() => {
    setSelectedOpportunity(
      props.opportunityList?.filter((e) => e.id === values.opportunityId)
    );
  }, [props.opportunityList]);

  useEffect(() => {
    setSelectedClient(
      props.clientList?.filter((e) => e.id === values.clientId)
    );
  }, [props.clientList]);

  const [clientSearchObject, setClientSearchObject] = useState({ name: '' });
  const [opportunitySearchObject, setOpportunitySearchObject] = useState(
    OpportunityDefaultParam
  );

  const ChangeClientSearchParams = (value: string, key: string) => {
    const tempSearchObject = { ...clientSearchObject, [key]: value };
    setClientSearchObject(tempSearchObject);
  };
  const ChangeOpportunitySearchParams = (value: string, key: string) => {
    const tempSearchObject = { ...opportunitySearchObject, [key]: value };
    setOpportunitySearchObject(tempSearchObject);
  };
  const dispatch: AppDispatch = useDispatch();

  const onClickSearchClient = () => {
    dispatch(getClientList(clientSearchObject));
  };
  const clientSearchBar = () => {
    return (
      <div className={`${ROOT}__search-header-container`}>
        <div className={`${ROOT}__search-header-container__item`}>
          <FormField title={msg().Psa_Lbl_Name}>
            <TextField
              value={clientSearchObject.name}
              onChange={(e) => ChangeClientSearchParams(e.target.value, 'name')}
            />
          </FormField>
        </div>
        <div className={`${ROOT}__search-button-container`}>
          <IconButton
            src={btnSearch}
            className={`${ROOT}__search-button`}
            onClick={onClickSearchClient}
          />
        </div>
      </div>
    );
  };

  const onOpportunityClickSearch = () => {
    dispatch(getOpportunityList(opportunitySearchObject));
  };
  const opportunitySearchBar = () => {
    return (
      <div className={`${ROOT}__search-header-container`}>
        <FormField
          title={msg().Psa_Lbl_ClientInfoOpportunityName}
          testId={`${ROOT}__opportunity-name`}
        >
          <TextField
            value={opportunitySearchObject.name}
            onChange={(e) =>
              ChangeOpportunitySearchParams(e.target.value, 'name')
            }
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ClientInfoAccountName}
          testId={`${ROOT}__account-name`}
        >
          <TextField
            value={opportunitySearchObject.accountName}
            onChange={(e) =>
              ChangeOpportunitySearchParams(e.target.value, 'accountName')
            }
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ClientInfoCreatedDate}
          testId={`${ROOT}__created-date`}
        >
          <PsaDateRangeField
            startDateFieldProps={{
              value: opportunitySearchObject.createdFrom,
              onChange: (value) =>
                ChangeOpportunitySearchParams(value, 'createdFrom'),
            }}
            endDateFieldProps={{
              value: opportunitySearchObject.createdTo,
              onChange: (value) =>
                ChangeOpportunitySearchParams(value, 'createdTo'),
            }}
          />
        </FormField>
        <div className={`${ROOT}__search-button-container`}>
          <IconButton
            src={btnSearch}
            className={`${ROOT}__search-button`}
            onClick={onOpportunityClickSearch}
          />
        </div>
      </div>
    );
  };

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
                eItem.categoryType === CategoryType.ProjectBaseInfo && (
                  <FormField
                    title={eItem.name}
                    testId={`${ROOT}__eI`}
                    isRequired={eItem.required}
                    error={errors[eItem.id]}
                    errorTextClassName={`${ROOT}__errText`}
                    isTouched={errors[eItem.id] || touched[eItem.id]}
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
  return (
    <>
      <div
        className={`${FORM_ROOT}__title`}
        style={{ marginTop: props.createProject && '20px' }}
      >
        {msg().Psa_Lbl_FormBaseInfo}
      </div>
      <section ref={refArray[0]} className={ROOT}>
        <FormField
          title={msg().Psa_Lbl_ProjectTitle}
          className={`${ROOT}__project-title`}
          isRequired
          error={errors.name}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.name}
          testId={`${ROOT}__name`}
          tooltip={props.customHint.title}
        >
          <TextField
            onChange={(e) => {
              props.setFieldValue('name', e.target.value);
            }}
            disabled={isPermissionRead}
            value={values.name}
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ProjectCode}
          isRequired
          error={useExistingJobCode ? errors.jobId : errors.code}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={useExistingJobCode ? touched.jobId : touched.code}
          testId={`${ROOT}__code`}
          tooltip={props.customHint.code}
        >
          {useExistingJobCode ? (
            <ClearableField
              onClickClearBtn={() => {
                props.setFieldValue('jobId', '');
                props.setFieldValue('jobCode', '');
              }}
              openDialog={onClickShowDialog}
              dialogProps={{
                singleSelection: true,
              }}
              labelSelectBtn={msg().Admin_Lbl_SelectParentJob}
              label={selectedJobLabel}
              disabled={
                (isEverythingElseDisabled && !props.createProject) ||
                isPermissionRead
              }
              dialog={null}
              isDialogOpen={false}
            />
          ) : (
            <TextField
              disabled={isEverythingElseDisabled || isPermissionRead}
              onChange={(e) => {
                props.setFieldValue('code', e.target.value);
              }}
              value={values.code}
            />
          )}
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ProjectDuration}
          className={`${ROOT}__date`}
          error={errors.startDate || errors.endDate}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.startDate || touched.endDate}
          isRequired={true}
          tooltip={props.customHint.duration}
        >
          <PsaDateField
            disabled={
              (!props.createProject && isEverythingElseDisabled) ||
              isPermissionRead
            }
            placeholder={msg().Psa_Lbl_StartDate}
            value={targetDate}
            onChange={(startDate) => {
              props.setFieldValue('startDate', startDate);
            }}
            dataTestId={`${ROOT}__start-date`}
          />
          <span className={`${ROOT}__separator`}>-</span>
          <PsaDateField
            disabled={disableEndDate || isPermissionRead}
            placeholder={msg().Psa_Lbl_EndDate}
            value={DateUtil.format(values.endDate, 'YYYY-MM-DD')}
            onChange={(endDate) => {
              props.setFieldValue('endDate', endDate);
            }}
            dataTestId={`${ROOT}__end-date`}
          />
        </FormField>

        <FormField
          title={msg().Com_Lbl_Status}
          error={errors.status}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.status}
          testId={`${ROOT}__status`}
          tooltip={props.customHint.status}
        >
          <SelectField
            disabled={isPermissionRead}
            onChange={(e) => {
              props.setFieldValue('status', e.target.value);
            }}
            options={statusOption}
            value={values.status}
          />
        </FormField>

        <FormField
          title={msg().Psa_Lbl_ProjectClient}
          tooltip={props.customHint.client}
        >
          <SelectionDialog
            name={msg().Psa_Lbl_SelectClient}
            title={msg().Psa_Lbl_SelectClient}
            headerList={[msg().Psa_Lbl_ProjectClient]}
            resultGridSize={[12]}
            listData={props.clientList}
            selectLimit={1}
            selectedList={selectedClient}
            searchBar={clientSearchBar}
            isResetted={true}
            disabled={isPermissionRead}
            onSelect={(resultSet: Set<any>) => {
              const results = Array.from(resultSet);
              if (results.length) {
                props.setFieldValue('clientId', results[0].id);
                setSelectedClient(
                  props.clientList.filter((e) => e.id === results[0].id)
                );
              }
            }}
            initializeSearchObject={setClientSearchObject}
            listDisplayHelper={['name']}
            searchFunction={(client) => getClientList(client)}
            onRemove={() => {
              props.setFieldValue('clientId', '');
              setSelectedClient(null);
            }}
            defaultParam={{
              name: '',
              recordsLimit: 100,
              searchEmptyName: true,
            }}
            hrefLink={`${window.origin}/lightning/r/Account`}
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ClientInfoOpportunity}
          testId={`${ROOT}__opportunity`}
          error={errors.opportunityId}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.opportunityId}
          tooltip={props.customHint.opportunity}
        >
          <SelectionDialog
            name={msg().Psa_Lbl_ClientInfoSelectOpportunity}
            title={msg().Psa_Lbl_ClientInfoSelectOpportunity}
            headerList={[
              msg().Psa_Lbl_ClientInfoOpportunityName,
              msg().Psa_Lbl_ClientInfoAccountName,
              msg().Psa_Lbl_ClientInfoCreatedDate,
            ]}
            listDisplayHelper={['name', 'accountName', 'createdDate']}
            resultGridSize={[4, 4, 4]}
            listData={props.opportunityList}
            selectLimit={1}
            selectedList={selectedOpportunity}
            isResetted={true}
            searchBar={opportunitySearchBar}
            disabled={isPermissionRead}
            searchFunction={getOpportunityList}
            onSelect={(resultSet: Set<any>) => {
              const results = Array.from(resultSet);
              if (results.length) {
                props.setFieldValue('opportunityId', results[0].id);
                setSelectedOpportunity(
                  props.opportunityList.filter((e) => e.id === results[0].id)
                );
              }
            }}
            initializeSearchObject={setOpportunitySearchObject}
            defaultParam={OpportunityDefaultParam}
            onRemove={() => {
              props.setFieldValue('opportunityId', null);
            }}
            hrefLink={`${window.origin}/lightning/r/Opportunity`}
          />
        </FormField>
        <FormField
          title={msg().Psa_Lbl_ProjectDescription}
          className={`${ROOT}__desc`}
          error={errors.description}
          errorTextClassName={`${ROOT}__errText`}
          isTouched={touched.description}
          testId={`${ROOT}__description`}
          tooltip={props.customHint.description}
        >
          <TextAreaField
            disabled={isPermissionRead}
            onChange={(e) => {
              props.setFieldValue('description', e.target.value);
            }}
            value={values.description || ''}
          />
        </FormField>

        {renderedExtendedItem}
      </section>
    </>
  );
};

export default BaseInfo;
