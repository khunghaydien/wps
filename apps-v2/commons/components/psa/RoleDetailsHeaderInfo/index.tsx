import React, { useState } from 'react';

import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import DateUtil from '../../../utils/DateUtil';

import ChevronDown from '../../../images/icons/fa-chevrondown.svg';
import msg from '../../../languages';
import { mapSkillWithCommas } from '../SkillSelectionField/SkillNameHelper';

import './index.scss';

type Props = {
  currencyCode?: string;
  isOmitFields?: boolean;
  selectedRole: any;
};

const ROOT = 'ts-psa__role-details__header-info';
export const ROLE_DETAILS_HEADER_ITEM = `${ROOT}-item`;

const RoleDetailsHeaderInfo = (props: Props) => {
  const [isExpanded, setExpanded] = useState(true);
  const { startDate, endDate } = props.selectedRole;
  const roleDuration = `${DateUtil.format(startDate)} - ${DateUtil.format(
    endDate
  )}`;

  const skills = props.selectedRole.skills
    ? props.selectedRole.skills.map(mapSkillWithCommas)
    : '-';
  const roleJobGrade = props.selectedRole.jobGrades
    ? props.selectedRole.jobGrades
        .map((jobGrade) => {
          let detailJobGrade = jobGrade.name;
          if (jobGrade.costRate && jobGrade.costRate > 0) {
            detailJobGrade += `/ ${
              props.currencyCode ? props.currencyCode : ''
            } ${jobGrade.costRate}`;
          }
          return detailJobGrade;
        })
        .join(', ')
    : msg().Psa_Lbl_NotSpecifiedJobGrade;

  const filterRoleTitle = (
    <span className={`${ROLE_DETAILS_HEADER_ITEM}`}>
      <label className={`${ROOT}-label`}>
        {msg().Psa_Lbl_ProjectRoleTitle}:
      </label>
      {props.selectedRole.roleTitle || '-'}
    </span>
  );

  const filterJobGrade = (
    <span className={`${ROLE_DETAILS_HEADER_ITEM}`}>
      <label className={`${ROOT}-label`}>{msg().Admin_Lbl_JobGrade}:</label>
      {roleJobGrade}
    </span>
  );

  const filterDuration = (
    <span className={`${ROLE_DETAILS_HEADER_ITEM}`}>
      <label className={`${ROOT}-label`}>{msg().Psa_Lbl_Duration}:</label>
      {roleDuration}
    </span>
  );

  const filterRequiredEffort = (
    <span className={`${ROLE_DETAILS_HEADER_ITEM}`}>
      <label className={`${ROOT}-label`}>{msg().Psa_Lbl_RequiredEffort}:</label>
      {props.selectedRole.requiredTime
        ? `${floorToOneDecimal(+props.selectedRole.requiredTime / 60)} ${
            msg().Psa_Lbl_Hours
          }`
        : '-'}
    </span>
  );

  const filterSkills = (
    <span className={`${ROLE_DETAILS_HEADER_ITEM} ${ROOT}-skills`}>
      <label className={`${ROOT}-label`}>
        {msg().Psa_Lbl_RequiredSkillsets}:
      </label>
      <div className={`${ROOT}-remarks-content`}>{skills}</div>
    </span>
  );

  const filterRemarks = (
    <span className={`${ROLE_DETAILS_HEADER_ITEM} ${ROOT}-remarks`}>
      <label className={`${ROOT}-label`}>
        {msg().Psa_Lbl_ProjectDescription}:
      </label>
      <div className={`${ROOT}-remarks-content`}>
        {props.selectedRole.remarks || '-'}
      </div>
    </span>
  );

  const expandClass = isExpanded ? 'js-is-expanded' : '';

  return (
    <div className={`${ROOT} ${expandClass}`}>
      <button
        className={`${ROOT}--buttons`}
        onClick={() => setExpanded(!isExpanded)}
      >
        <span className={`${ROOT}__toggle-icon-bg`}>
          <ChevronDown className={`${ROOT}__toggle-icon`}></ChevronDown>
        </span>
        <span>
          {isExpanded
            ? msg().Psa_Lbl_CloseRoleRequestDetail
            : msg().Psa_Lbl_OpenRoleRequestDetail}
        </span>
      </button>
      <div className={`${ROOT}__column`}>
        {filterDuration}
        {filterRoleTitle}
        {filterSkills}
      </div>
      <div className={`${ROOT}__column`}>
        {!props.isOmitFields && filterRequiredEffort}
        {!props.isOmitFields && filterJobGrade}
        {!props.isOmitFields && filterRemarks}
      </div>
    </div>
  );
};

export default RoleDetailsHeaderInfo;
