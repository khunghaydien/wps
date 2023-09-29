import React from 'react';

import classNames from 'classnames';

import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';
import DateUtil from '@commons/utils/DateUtil';

import { AssignmentDetail } from '@apps/domain/models/psa/Resource';
import { RoleStatus } from '@apps/domain/models/psa/RoleStatus';

import './index.scss';

type Props = {
  assignmentDetail: AssignmentDetail;
  availableHours?: Array<Array<number>>;
  currentDateIndicator?: Array<boolean>;
  hideTotalHours?: boolean;
  openRoleDetails?: (roleId: string) => void;
  outOfRangeArray: Array<boolean>;
  testId: string;
  totalAvailableHours: number;
};

const ROOT = 'ts-psa__resource-planner__resource-list-item';

const AssignmentItem = (props: Props) => {
  const { assignmentDetail } = props;
  const assignmentStatus = assignmentDetail.status;
  const EMPLOYEE_NAME_CLASS = `${ROOT}__name-onclick`;
  const isNonProject = assignmentStatus === '-';
  const isConfirmed = assignmentStatus === RoleStatus.Confirmed;
  const isInProgress = assignmentStatus === RoleStatus.InProgress;
  const isSoftBooked = assignmentStatus === RoleStatus.SoftBooked;
  const isCompleted = assignmentStatus === RoleStatus.Completed;

  // default assignmentDetailInfo to just projectTitle
  let assignmentDetailInfo: any = assignmentDetail.projectTitle;

  // if jobCode exists, append - jobCode
  if (assignmentDetail.projectJobCode) {
    assignmentDetailInfo += ` - ${assignmentDetail.projectJobCode}`;
  }

  if (assignmentDetail.roleId === null) {
    assignmentDetailInfo = assignmentDetail.roleTitle;
  }

  // if roleId exists, make is a clickable link
  if (props.openRoleDetails && assignmentDetail.roleId) {
    assignmentDetailInfo = (
      <a
        className={EMPLOYEE_NAME_CLASS}
        onClick={() => props.openRoleDetails(assignmentDetail.roleId)}
      >
        {assignmentDetailInfo}
      </a>
    );
  }

  let clientNameAndDate = assignmentDetail.clientName || '';
  if (assignmentDetail.endDate) {
    if (assignmentDetail.clientName) {
      clientNameAndDate += ' - ';
    }
    clientNameAndDate += `(${DateUtil.customFormat(
      assignmentDetail.startDate
    )} - ${DateUtil.customFormat(assignmentDetail.endDate)})`;
  }

  const renderFirstColumn = (
    <div className={`${ROOT}__first-column`}>
      <div className={`${ROOT}__resource-item-info`}>
        <span className={`${ROOT}__resource-item-info__first-row`}>
          {assignmentDetailInfo}
        </span>
        <span>{clientNameAndDate}</span>
      </div>
    </div>
  );

  return (
    <div className={`${ROOT}`} data-testid={props.testId}>
      <div className={`${ROOT}__resources`}>{renderFirstColumn}</div>
      <div className={`${ROOT}__values`}>
        {!props.hideTotalHours && (
          <div className={`${ROOT}__total-hours`}>
            {floorToOneDecimal(props.totalAvailableHours / 60)}
          </div>
        )}
        {props.availableHours &&
          props.availableHours[0] !== undefined &&
          props.availableHours.map((hours) =>
            hours.map((minutes, index) => {
              const hour = minutes === -1 ? 0 : minutes / 60;
              const isNonProjectAndNotAvailable = isNonProject && minutes === 0;
              const isOutOfRange =
                props.outOfRangeArray[index] || isNonProjectAndNotAvailable;
              const isToday =
                props.currentDateIndicator && props.currentDateIndicator[index];
              const isNotAvailable =
                minutes === -1 || isNonProjectAndNotAvailable;
              const isFullyBooked = hour === 0;
              let hourDisplay: any = isOutOfRange ? '-' : hour;
              if (hour && hour > 0) {
                hourDisplay = minutes / 60;
              }
              if (!isNaN(hourDisplay)) {
                hourDisplay = floorToOneDecimal(hourDisplay);
              }
              const bookedColorCSS = classNames({
                'is-notAvailable':
                  isOutOfRange || isNotAvailable || isFullyBooked,
                'is-confirmed': isConfirmed || isInProgress || isCompleted,
                'is-softBooked': isSoftBooked,
                'is-nonProject': isNonProject,
              });

              return (
                <span
                  className={`${ROOT}__background ${isToday && 'is-today'}`}
                >
                  <span
                    className={`${ROOT}__booked-hour-value ${bookedColorCSS}`}
                  >
                    {hourDisplay}
                  </span>
                </span>
              );
            })
          )}
      </div>
    </div>
  );
};

export default AssignmentItem;
