/* eslint-disable camelcase */
import React from 'react';

import groupBy from 'lodash/groupBy';
import moment from 'moment';

import LockIcon from '@apps/commons/images/icons/lock.svg';

import { CapabilityInfo } from '../../../../domain/models/psa/CapabilityInfo';

import DateUtil from '../../../utils/DateUtil';

import msg from '../../../languages/index';
import DialogFrame from '../../dialogs/DialogFrame';

import './index.scss';

type Props = {
  employeeCapabilityInfo: CapabilityInfo;
  hideDialog: () => void;
};

const ROOT = 'ts-psa__employee-capability-dialog';

const EmployeeCapabilityInfo = (props: Props) => {
  const getMonthDiff = (startDate: string, endDate: string) => {
    let result = '';
    const diff = moment(new Date(endDate)).diff(
      new Date(startDate),
      'months',
      true
    );

    const roundedDiff = Math.round(diff);

    if (roundedDiff > 0) {
      result = ` (${roundedDiff} ${msg().Com_Lbl_Month})`;
    } else if (diff > 1) {
      result = ` (${roundedDiff} ${msg().Com_Lbl_Months})`;
    }

    return result;
  };

  const renderSkillsItem = () => {
    const { skills } = props.employeeCapabilityInfo;
    let results: string | JSX.Element[] =
      msg().Psa_Msg_CapabilityNoSkillProficiency;
    if (skills) {
      // 1. Sort by skills name alphabetically
      const sortedSkills = skills.sort((a, b) => {
        if (a.skillName < b.skillName) {
          return -1;
        }
        if (a.skillName > b.skillName) {
          return 1;
        }
        return 0;
      });

      // 2. Group by category name
      const categories = groupBy(sortedSkills, (_) => _.categoryName);

      // 3. Sort by category name
      const sortedCategories = {};
      Object.keys(categories)
        .sort()
        .forEach(function (key) {
          sortedCategories[key] = categories[key];
        });

      results = Object.keys(sortedCategories).map((category) => (
        <div className={`${ROOT}__skills-item-category`}>
          <p className={`${ROOT}__skills-item-category-title`}>{category}</p>

          {sortedCategories[category].map((skill) => {
            const { rating, grades } = skill;
            let skillRating = '';

            if (rating) {
              if (grades) {
                skillRating = ` / ${grades[rating]}`;
              } else if (rating !== '0') {
                skillRating = ` / ${rating}`;
              }
            }

            return (
              <span className={`${ROOT}__skills-item-details`}>
                {skill.skillName}
                {skillRating}
              </span>
            );
          })}
        </div>
      ));
    }

    return results;
  };

  const DetailsItem = (label: string, value: string) => (
    <div className={`${ROOT}__details-item`}>
      <span className={`${ROOT}__details-label`}>{label}</span>
      <span className={`${ROOT}__details-divider`}>:</span>
      <span className={`${ROOT}__details-value`}>{value || '-'}</span>
    </div>
  );

  const { personalInfoUrl } = props.employeeCapabilityInfo;
  let sanitisedPersonalInfoUrl = '';

  if (personalInfoUrl) {
    const lastSegmentOfUrl = personalInfoUrl.split('/').pop() || '';
    sanitisedPersonalInfoUrl =
      lastSegmentOfUrl !== 'null' ? personalInfoUrl : '';
  }

  const dialogHeader = sanitisedPersonalInfoUrl ? (
    <React.Fragment>
      <span className={`${ROOT}__title`}>
        {msg().Psa_Lbl_CapabilityProfile}
      </span>
      <a
        className={`${ROOT}--confidential`}
        href={personalInfoUrl}
        target="_blank"
        rel="noreferrer"
      >
        <span className={`${ROOT}__lock-icon`}>
          <LockIcon />
        </span>
        {msg().Psa_Lbl_PersonalProfile}
      </a>
    </React.Fragment>
  ) : (
    msg().Psa_Lbl_CapabilityProfile
  );

  // @ts-ignore
  const { empNameL, empName_L0, empName_L1 } = props.employeeCapabilityInfo;
  const secondaryName = empNameL === empName_L0 ? empName_L1 : empName_L0;
  const empName = empNameL + (secondaryName ? ` (${secondaryName})` : '');

  return (
    <DialogFrame
      title={dialogHeader}
      hide={props.hideDialog}
      className={`${ROOT}__dialog-frame`}
    >
      <div className={`${ROOT}__inner`}>
        <div className={`${ROOT}`}>
          <div className={`${ROOT}__avatar-container`}>
            <img src={props.employeeCapabilityInfo.empPhotoUrl} />
            <span className={`${ROOT}__avatar-container__emp-name`}>
              {empName}
            </span>
            <span className={`${ROOT}__avatar-container__emp-position`}>
              {props.employeeCapabilityInfo.empPosition}
            </span>
          </div>

          <div className={`${ROOT}__project-activities-num-container`}>
            <div className={`${ROOT}__project-num`}>
              <span className={`${ROOT}__num-value`}>
                {props.employeeCapabilityInfo.projectNum}
              </span>
              <span>{msg().Psa_Lbl_Projects}</span>
            </div>
            <div className={`${ROOT}__divider`}>
              <hr className={`${ROOT}__vertical-divider`} />
            </div>
            <div className={`${ROOT}__activity-num`}>
              <span className={`${ROOT}__num-value`}>
                {props.employeeCapabilityInfo.activitiesNum}
              </span>
              <span>{msg().Psa_Lbl_Activities}</span>
            </div>
          </div>

          <span className={`${ROOT}__basic-info-header`}>
            {msg().Admin_Lbl_BaseInfo}
          </span>
          <div className={`${ROOT}__details-container`}>
            {DetailsItem(
              msg().Psa_Lbl_CapabilityEmpCode,
              props.employeeCapabilityInfo.empCode
            )}
            {DetailsItem(
              msg().Psa_Lbl_CapabilityDepartment,
              props.employeeCapabilityInfo.empDeptName
            )}
            {DetailsItem(
              msg().$Psa_Clbl_JobGrade,
              props.employeeCapabilityInfo.empGrade
            )}
            {DetailsItem(
              msg().Psa_Lbl_CapabilityDateOfHire,
              DateUtil.format(props.employeeCapabilityInfo.empHiredDate)
            )}
            {DetailsItem(
              msg().Psa_Lbl_CapabilityEmail,
              props.employeeCapabilityInfo.empEmail
            )}

            {props.employeeCapabilityInfo.links &&
              props.employeeCapabilityInfo.links.map((link) => (
                <div className={`${ROOT}__details-item`}>
                  <span className={`${ROOT}__details-label`}>{link.name}</span>
                  <span className={`${ROOT}__details-divider`}>:</span>
                  <a
                    className={`${ROOT}__details-value`}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link.url}
                  >
                    {link.url}
                  </a>
                </div>
              ))}

            {DetailsItem(
              msg().Psa_Lbl_CapabilityRemarks,
              props.employeeCapabilityInfo.remarks
            )}
          </div>

          {props.employeeCapabilityInfo.skills.length > 0 && (
            <div className={`${ROOT}__skills-container`}>
              <span className={`${ROOT}__skills-header`}>
                {msg().Psa_Lbl_CapabilitySkillProficiency}
              </span>
              <span className={`${ROOT}__skills-item`}>
                {renderSkillsItem()}
              </span>
            </div>
          )}

          <div className={`${ROOT}__activities-container`}>
            <span className={`${ROOT}__activity-session-header`}>
              {msg().Psa_Lbl_CapabilityAssignmentHistory}
            </span>
            <div className={`${ROOT}__activity-item-container`}>
              {props.employeeCapabilityInfo.assignments &&
                props.employeeCapabilityInfo.assignments.map((activity) => (
                  <div className={`${ROOT}__activity-item`}>
                    <div className={`${ROOT}__activity-project`}>
                      <span className={`${ROOT}__activity-project-indicator`} />
                      <span className={`${ROOT}__activity-project-name`}>
                        {activity.projectName}
                      </span>
                      {activity.clientName && (
                        <span className={`${ROOT}__activity-client-name`}>
                          {` - ${activity.clientName}`}
                        </span>
                      )}
                      {activity.pmName && (
                        <span className={`${ROOT}__activity-pm-name`}>
                          {` - ${activity.pmName}`}
                        </span>
                      )}
                    </div>
                    <div className={`${ROOT}__activity-assignment`}>
                      <span
                        className={`${ROOT}__activity-assignment-indicator`}
                      />
                      <span className={`${ROOT}__activity-role-name`}>
                        {activity.assignmentName}
                      </span>
                    </div>
                    <div className={`${ROOT}__activity-duration`}>
                      <span
                        className={`${ROOT}__activity-duration-indicator`}
                      />
                      <span className={`${ROOT}__activity-duration-details`}>
                        {DateUtil.format(activity.startDate)}
                        {' - '}
                        {DateUtil.format(activity.endDate)}
                        {getMonthDiff(activity.startDate, activity.endDate)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DialogFrame>
  );
};

export default EmployeeCapabilityInfo;
