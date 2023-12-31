import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const { FIELD_HIDDEN, FIELD_TEXTAREA } = fieldType;

const base: ConfigList = [
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
  },
  {
    key: 'moduleType',
    type: FIELD_HIDDEN,
  },
  {
    section: 'PsaProject',
    msgkey: 'Admin_Lbl_Project',
    isExpandable: true,
    configList: [
      {
        key: 'title',
        msgkey: 'Psa_Lbl_ProjectTitle',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'title_L0',
        msgkey: 'Psa_Lbl_ProjectTitle',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'title_L1',
        msgkey: 'Psa_Lbl_ProjectTitle',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'code',
        msgkey: 'Psa_Lbl_ProjectCode',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'code_L0',
        msgkey: 'Psa_Lbl_ProjectCode',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'code_L1',
        msgkey: 'Psa_Lbl_ProjectCode',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'duration',
        msgkey: 'Psa_Lbl_ProjectDuration',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'duration_L0',
        msgkey: 'Psa_Lbl_ProjectDuration',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'duration_L1',
        msgkey: 'Psa_Lbl_ProjectDuration',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'workHoursPerDay',
        msgkey: 'Psa_Lbl_WorkTimePerDay',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'workHoursPerDay_L0',
        msgkey: 'Psa_Lbl_WorkTimePerDay',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'workHoursPerDay_L1',
        msgkey: 'Psa_Lbl_WorkTimePerDay',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'workHoursPerDay_L2',
        msgkey: 'Psa_Lbl_WorkTimePerDay',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'targetMargin',
        msgkey: 'Psa_Lbl_TargetMargin',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'targetMargin_L0',
        msgkey: 'Psa_Lbl_TargetMargin',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'targetMargin_L1',
        msgkey: 'Psa_Lbl_TargetMargin',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'targetMargin_L2',
        msgkey: 'Psa_Lbl_TargetMargin',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'status',
        msgkey: 'Psa_Lbl_Status',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'status_L0',
        msgkey: 'Psa_Lbl_Status',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'status_L1',
        msgkey: 'Psa_Lbl_Status',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'status_L2',
        msgkey: 'Psa_Lbl_Status',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'resourceGroup',
        msgkey: 'Admin_Lbl_ResourceGroup',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'resourceGroup_L0',
        msgkey: 'Admin_Lbl_ResourceGroup',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'resourceGroup_L1',
        msgkey: 'Admin_Lbl_ResourceGroup',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'resourceGroup_L2',
        msgkey: 'Admin_Lbl_ResourceGroup',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectWorkingDays',
        msgkey: 'Psa_Lbl_WorkingDays',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'projectWorkingDays_L0',
        msgkey: 'Psa_Lbl_WorkingDays',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectWorkingDays_L1',
        msgkey: 'Psa_Lbl_WorkingDays',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectWorkingDays_L2',
        msgkey: 'Psa_Lbl_WorkingDays',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectManager',
        msgkey: 'Psa_Lbl_ProjectManager',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'projectManager_L0',
        msgkey: 'Psa_Lbl_ProjectManager',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectManager_L1',
        msgkey: 'Psa_Lbl_ProjectManager',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectManager_L2',
        msgkey: 'Psa_Lbl_ProjectManager',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectDepartment',
        msgkey: 'Psa_Lbl_ProjectDepartment',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'projectDepartment_L0',
        msgkey: 'Psa_Lbl_ProjectDepartment',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectDepartment_L1',
        msgkey: 'Psa_Lbl_ProjectDepartment',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectDepartment_L2',
        msgkey: 'Psa_Lbl_ProjectDepartment',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectCheckFrequency',
        msgkey: 'Psa_Lbl_ProjectCheckFrequency',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'projectCheckFrequency_L0',
        msgkey: 'Psa_Lbl_ProjectCheckFrequency',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectCheckFrequency_L1',
        msgkey: 'Psa_Lbl_ProjectCheckFrequency',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'projectCheckFrequency_L2',
        msgkey: 'Psa_Lbl_ProjectCheckFrequency',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'planningCycle',
        msgkey: 'Psa_Lbl_PlanningCycle',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'planningCycle_L0',
        msgkey: 'Psa_Lbl_PlanningCycle',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'planningCycle_L1',
        msgkey: 'Psa_Lbl_PlanningCycle',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'planningCycle_L2',
        msgkey: 'Psa_Lbl_PlanningCycle',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'opportunity',
        msgkey: 'Psa_Lbl_ClientInfoOpportunity',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'opportunity_L0',
        msgkey: 'Psa_Lbl_ClientInfoOpportunity',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'opportunity_L1',
        msgkey: 'Psa_Lbl_ClientInfoOpportunity',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'opportunity_L2',
        msgkey: 'Psa_Lbl_ClientInfoOpportunity',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'firstCheckDate',
        msgkey: 'Psa_Lbl_ProgressFirstDate',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'firstCheckDate_L0',
        msgkey: 'Psa_Lbl_ProgressFirstDate',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'firstCheckDate_L1',
        msgkey: 'Psa_Lbl_ProgressFirstDate',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'firstCheckDate_L2',
        msgkey: 'Psa_Lbl_ProgressFirstDate',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'description',
        msgkey: 'Psa_Lbl_ProjectDescription',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'description_L0',
        msgkey: 'Psa_Lbl_ProjectDescription',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'description_L1',
        msgkey: 'Psa_Lbl_ProjectDescription',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'description_L2',
        msgkey: 'Psa_Lbl_ProjectDescription',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'contractType',
        msgkey: 'Psa_Lbl_ContractType',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'contractType_L0',
        msgkey: 'Psa_Lbl_ContractType',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'contractType_L1',
        msgkey: 'Psa_Lbl_ContractType',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'contractType_L2',
        msgkey: 'Psa_Lbl_ContractType',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'contractAmount',
        msgkey: 'Psa_Lbl_ContractAmount',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'contractAmount_L0',
        msgkey: 'Psa_Lbl_ContractAmount',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'contractAmount_L1',
        msgkey: 'Psa_Lbl_ContractAmount',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'contractAmount_L2',
        msgkey: 'Psa_Lbl_ContractAmount',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'client',
        msgkey: 'Psa_Lbl_ProjectClient',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'client_L0',
        msgkey: 'Psa_Lbl_ProjectClient',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'client_L1',
        msgkey: 'Psa_Lbl_ProjectClient',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'client_L2',
        msgkey: 'Psa_Lbl_ProjectClient',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'calendar',
        msgkey: 'Psa_Lbl_Calendar',
        type: FIELD_TEXTAREA,
        display: DISPLAY_LIST,
      },
      {
        key: 'calendar_L0',
        msgkey: 'Psa_Lbl_Calendar',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'calendar_L1',
        msgkey: 'Psa_Lbl_Calendar',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'calendar_L2',
        msgkey: 'Psa_Lbl_Calendar',
        type: FIELD_TEXTAREA,
        display: DISPLAY_DETAIL,
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
