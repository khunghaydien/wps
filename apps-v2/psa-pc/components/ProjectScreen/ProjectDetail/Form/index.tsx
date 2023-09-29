import React, { useEffect, useState } from 'react';

import ErrorBox from '@apps/commons/components/psa/ErrorBox';
import msg from '@apps/commons/languages';

import { ClientList } from '@apps/domain/models/psa/Client';
import { CustomHint } from '@apps/domain/models/psa/CustomHint';
import { OpportunityList } from '@apps/domain/models/psa/Opportunity';
import { Project } from '@apps/domain/models/psa/Project';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';
import { ResourceManager } from '@apps/domain/models/psa/ResourceManager';

import BaseInfo from './BaseInfo';
import Financials from './Financials';
// import NotificationSettings from './NotificationSettings';
import Operation from './Operation';
import PlanningOptions from './PlanningOptions';

import './index.scss';

// errors, touched and values cannot pre-defined anymore
// due to dynamic nature of extended item
type FormikProps = {
  errors: any;
  touched: any;
  values: any;
  handleSubmit: () => void;
  setFieldValue: (arg0: string, arg1: any) => void;
};

export type Props = {
  catchBusinessError: (type: string, message: string, solution: string) => void;
  companyId: string;
  useExistingJobCode: boolean;
  managerListOption: Array<any>;
  deptSuggestList: Array<any>;
  searchClientList: (value: string) => void;
  calendarListOption: Array<any>;
  refArray: Array<any>;
  searchEmployeeList: (value: string) => void;
  getManagerList: (suggestList: any) => void;
  saveProjectManagerLocally: (projectManagerId: string) => void;
  resourceManagerList: Array<ResourceManager>;
  opportunityList: OpportunityList;
  clientList: ClientList;
  projectManagerId: string;
  selectedProject: Project;
  getResourceManagerListByProjectManagerId?: (projectManagerId: string) => void;
  resourceGroupList: Array<any>;
  extendedItemConfigList: Array<PsaExtendedItem>;
  hasInProgressOrCompletedActivity: boolean;
  groupDetail: any;
  getGroupMembers: (arg0: any) => void;
  enableProgressCheck: boolean;
  isLoading?: boolean;
  currencyDecimal?: number;
  clientId: string;
  clientName: string;
  customHint: CustomHint;
  createProject?: boolean;
  validateForm: any;
  permission: string;
} & FormikProps;

export const ROOT = 'ts-psa__project-form';

const ProjectDetailForm = (props: Props) => {
  const [errorLabelObject, setErrorLabelObject] = useState({
    jobId: msg().Psa_Lbl_ProjectCode,
    pmBaseId: msg().Psa_Lbl_ProjectManager,
    name: msg().Psa_Lbl_ProjectTitle,
    startDate: msg().Psa_Lbl_StartDate,
    endDate: msg().Psa_Lbl_EndDate,
    code: msg().Psa_Lbl_ProjectCode,
    workTimePerDay: msg().Psa_Lbl_WorkTimePerDay,
    status: msg().Psa_Lbl_Status,
    groupId: msg().Psa_Lbl_ResourceGroup,
  });

  useEffect(() => {
    props.validateForm();
  }, [props.values.jobId, props.values.jobCode]);

  useEffect(() => {
    if (
      props.extendedItemConfigList &&
      props.extendedItemConfigList.length > 0
    ) {
      let errorLabelObjectWithEi = { ...errorLabelObject };
      props.extendedItemConfigList &&
        props.extendedItemConfigList.forEach((eItem) => {
          errorLabelObjectWithEi = {
            ...errorLabelObjectWithEi,
            [eItem.id]: eItem.name,
          };
        });
      setErrorLabelObject(errorLabelObjectWithEi);
    }
  }, [props.extendedItemConfigList, props.values, props.touched, props.errors]);
  const renderErrorBox = () => {
    return (
      Object.keys(props.touched).length !== 0 &&
      Object.keys(props.errors).length !== 0 && (
        <ErrorBox errors={props.errors} errorLabelObject={errorLabelObject} />
      )
    );
  };
  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__error-box`}>{renderErrorBox()}</div>
      <BaseInfo {...props} key="baseInfo" />
      <Operation {...props} key="operation" />
      <Financials {...props} key="financials" />
      <PlanningOptions {...props} key="planningOptions" />
      {/* <NotificationSettings {...props} key="notificationSettings" /> */}
    </div>
  );
};

export default ProjectDetailForm;
