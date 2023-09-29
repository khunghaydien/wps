import React from 'react';

import { Project } from '@apps/domain/models/psa/Project';
import { PsaExtendedItem } from '@apps/domain/models/psa/PsaExtendedItem';
import { ResourceManager } from '@apps/domain/models/psa/ResourceManager';

import BaseInfo from './BaseInfo';
import ClientInfo from './ClientInfo';
import Financial from './Financial';

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

/* type dropdownOptions = {
  value: string;
  code?: string;
  name?: string;
  text: string;
}; */

export type Props = {
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
  projectManagerId: string;
  selectedProject: Project;
  getResourceManagerListByProjectManagerId?: (projectManagerId: string) => void;
  resourceGroupList: Array<any>;
  extendedItemConfigList: Array<PsaExtendedItem>;
  hasInProgressOrCompletedActivity: boolean;
  groupDetail: any;
  getGroupMembers: (arg0: any) => void;
  catchBusinessError: (type: string, message: string, solution: string) => void;
  selectedGroupId: string;
} & FormikProps;

export const ROOT = 'ts-psa__project-form';

const ProjectDetailForm = (props: Props) => {
  return (
    <div className={`${ROOT}`}>
      <BaseInfo {...props} key="baseInfo" />
      <ClientInfo {...props} key="clientInfo" />
      <Financial {...props} key="financialInfo" />
    </div>
  );
};

export default ProjectDetailForm;
