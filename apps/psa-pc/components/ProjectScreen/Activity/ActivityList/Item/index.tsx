import React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import IconButton from '@apps/commons/components/buttons/IconButton';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import Tooltip from '@apps/commons/components/Tooltip';
import IconExpandClose from '@apps/commons/images/icons/iconExpandClose.svg';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import {
  ActivityListItem,
  ActivityStatus,
} from '@apps/domain/models/psa/Activity';

import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

type Props = {
  activityId: string;
  clearRoleLocally: () => void;
  editActivity: (activityId: string) => void;
  getRole: (assignmentId: string, activityId?: string) => void;
  isExpanded: boolean;
  openEmployeeCapabilityInfo?: (empId: string) => void;
  openNewRoleDialog: () => void;
  plannedEndDate: string;
  plannedStartDate: string;
  setActivityEndDate: (activityEndDate: string) => void;
  setActivityId: (activityId: string) => void;
  setActivityStartDate: (activityStartDate: string) => void;
  setActivityTitle: (activityTitle: string) => void;
  toggleExpand: () => void;
} & ActivityListItem;

const ROOT = 'ts-psa__activity-item';
const ACTIVITY_BTN_CLASS = 'ts-psa__activity-item__btn';
const ADD_ROLE_BTN_CLASS = 'ts-psa__activity-item__add-btn';
const EMPLOYEE_NAME_CLASS = 'ts-psa__activity-item__lead-name';
const EMPLOYEE_IMAGE_CLASS = 'ts-psa__activity-item__lead-photo';

function ActivityItem(props: Props) {
  const isExpandedClass = props.isExpanded ? 'is-expanded' : '';

  const isActivityCancelled = props.status === ActivityStatus.Cancelled;
  const isActivityCompleted = props.status === ActivityStatus.Completed;
  const isNewRoleBtnDisabled = isActivityCancelled || isActivityCompleted;

  const statusClass = classNames(`${ROOT}__status-item`, {
    'is-completed': isActivityCompleted,
    'is-in-progress': props.status === ActivityStatus.InProgress,
    'is-cancelled': isActivityCancelled,
    'is-in-planning': props.status === ActivityStatus.NotStarted,
  });

  const onClickOpenCapabilityInfo = (empId) => {
    if (props.openEmployeeCapabilityInfo && empId) {
      props.openEmployeeCapabilityInfo(empId);
    }
  };

  return (
    <div
      className={`${ROOT} ${isExpandedClass}`}
      data-testid={`${ROOT}--${props.activityId}`}
    >
      <MultiColumnsGrid
        className={`${ROOT}__header`}
        sizeList={[4, 2, 1, 1, 1, 3]}
        // @ts-ignore
        onClick={(e) => {
          if (
            e.target.className &&
            typeof e.target.className.includes !== 'undefined' &&
            !e.target.className.includes(ACTIVITY_BTN_CLASS) &&
            !e.target.className.includes(ADD_ROLE_BTN_CLASS) &&
            props.activityId
          ) {
            props.editActivity(props.activityId);
          }
        }}
      >
        <div className={`${ROOT}__name`}>
          {props.roles && props.roles.length > 0 ? (
            <IconButton
              className={`${ROOT}__btn`}
              data-testid={`${ROOT}--btn`}
              fillColor="#666666"
              onClick={props.toggleExpand}
              src={IconExpandClose}
              srcType="svg"
            />
          ) : (
            ''
          )}

          <span className={`${ROOT}__name-text`}>{props.title}</span>
        </div>
        <div className={`${ROOT}__status`}>
          <span className={statusClass} />
          &nbsp;&nbsp;{props.status && msg()[`Psa_Lbl_Status${props.status}`]}
        </div>

        <div className={`${ROOT}__request-no`}></div>

        <div className={`${ROOT}__start-date`}>
          {props.plannedStartDate && DateUtil.format(props.plannedStartDate)}
        </div>

        <div className={`${ROOT}__end-date`}>
          {props.plannedEndDate && DateUtil.format(props.plannedEndDate)}
        </div>
        <div className={`${ROOT}__lead`}>
          {moment(props.plannedEndDate).isSameOrAfter(moment(), 'day') &&
            !isNewRoleBtnDisabled && (
              <Tooltip
                align={'top'}
                content={msg().Psa_Lbl_AddNewRoleTooltip}
                className={`${ROOT}__add-btn`}
              >
                <IconAdd
                  data-testid={`${ROOT}--svg-add-btn`}
                  className={`${ROOT}__svg_add-btn`}
                  onClick={() => {
                    props.clearRoleLocally();
                    if (props.activityId) {
                      props.setActivityId(props.activityId);
                      props.setActivityTitle(props.title);
                      props.setActivityStartDate(props.plannedStartDate);
                      props.setActivityEndDate(props.plannedEndDate);
                    }
                    props.openNewRoleDialog();
                  }}
                  type="button"
                />
              </Tooltip>
            )}
        </div>
      </MultiColumnsGrid>
      <div className={`${ROOT}__content`}>
        {props.roles &&
          props.roles.map((i, index) => {
            const roleStatusClass = {
              Planning: 'is-in-planning',
              Requested: 'is-requested',
              SoftBooked: 'is-soft-booked',
              InProgress: 'is-in-progress',
              Confirmed: 'is-confirmed',
              NotFound: 'is-not-found',
              Cancelled: 'is-cancelled',
              Completed: 'is-completed',
              Scheduling: 'is-scheduling',
            };

            const roleStatusClasses = `${ROOT}__status-item ${
              roleStatusClass[i.status]
            }`;

            return (
              <MultiColumnsGrid
                className={`${ROOT}__item`}
                testId={`${ROOT}__item--${index}`}
                sizeList={[4, 2, 1, 1, 1, 3]}
                // @ts-ignore
                onClick={(e) => {
                  if (
                    !e.target.className.includes(EMPLOYEE_NAME_CLASS) &&
                    !e.target.className.includes(EMPLOYEE_IMAGE_CLASS)
                  ) {
                    props.getRole(i.roleId, props.activityId);
                  }
                }}
              >
                <div className={`${ROOT}__name`}>
                  <div>{i.roleTitle}</div>
                  {i.requesterName && (
                    <div className={`${ROOT}__requester`}>
                      {`${msg().Psa_Lbl_RequestedBy}: ${i.requesterName}`}
                    </div>
                  )}
                  {i.isDirectAssign && (
                    <div className={`${ROOT}__requester`}>
                      {msg().Psa_Lbl_PMDirectAssign}
                    </div>
                  )}
                </div>

                <div className={`${ROOT}__status`}>
                  <span className={roleStatusClasses} />
                  &nbsp;&nbsp;{i.status && msg()[`Psa_Lbl_Status${i.status}`]}
                </div>

                <div className={`${ROOT}__request-no`}>{i.requestNo}</div>

                <div className={`${ROOT}__start-date`}>
                  {DateUtil.format(i.startDate)}
                </div>

                <div className={`${ROOT}__end-date`}>
                  {DateUtil.format(i.endDate)}
                </div>
                {i.employeePhotoUrl ? (
                  <div className={`${ROOT}__lead`}>
                    <img
                      className={`${ROOT}__lead-photo`}
                      src={i.employeePhotoUrl}
                      onClick={() =>
                        onClickOpenCapabilityInfo(i.employeeBaseId)
                      }
                    />
                    <a
                      className={`${ROOT}__lead-name`}
                      onClick={() =>
                        onClickOpenCapabilityInfo(i.employeeBaseId)
                      }
                    >
                      {i.employeeName}
                    </a>
                  </div>
                ) : (
                  <div>
                    {i.status !== 'Cancelled' && msg().Psa_Lbl_ToBeAssigned}
                  </div>
                )}
              </MultiColumnsGrid>
            );
          })}
      </div>
    </div>
  );
}

export default ActivityItem;
