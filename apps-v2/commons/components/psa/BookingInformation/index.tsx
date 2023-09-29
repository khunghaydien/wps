import React, { useEffect } from 'react';

import get from 'lodash/get';

import CheckActiveIcon from '@apps/commons/images/icons/check-active.svg';
import TrashIcon from '@apps/commons/images/icons/trash.svg';
import ViewScheduleIcon from '@apps/commons/images/icons/viewSchedule.svg';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import CurrentRoute from '@apps/domain/models/psa/CurrentRoute';
import { Assignment, Role } from '@apps/domain/models/psa/Role';
import RoleStatus from '@apps/domain/models/psa/RoleStatus';

import './index.scss';

const ROOT = 'ts-psa__booking-information';

type Props = {
  canConfirmResource?: boolean;
  currentRoute: string;
  onClickShowScheduleDetails: () => void;
  openEmployeeCapabilityInfo?: (empId: string) => void;
  releaseRoleResource?: (
    assignmentId: string,
    assignments: Array<Assignment>
  ) => void;
  selectAssignment?: (assignment: Assignment) => void;
  selectedRole: Role;
};

const BookingInformation = (props: Props) => {
  useEffect(() => {
    if (
      props.selectedRole.assignments &&
      props.selectedRole.assignments.length === 1
    ) {
      props.selectAssignment(props.selectedRole.assignments[0]);
    }
  }, [props.selectedRole.assignments]);

  const onClickShowScheduleDetail = async (assignment: Assignment) => {
    await props.selectAssignment(assignment);
    props.onClickShowScheduleDetails();
  };

  const onSelectAssignment = (assignment: Assignment) => {
    props.selectAssignment(assignment);
  };

  const { assignments, assignment } = props.selectedRole;

  const renderScheduleDetails = () => {
    return assignments.map((resourceSchedule, index) => {
      const resourceName = get(resourceSchedule, 'employeeName', '');
      const resourceCode = get(resourceSchedule, 'employeeCode', '');
      const bookedHours = get(resourceSchedule, 'strategy.bookedEffort', 0);
      const resourcePhotoUrl = get(resourceSchedule, 'employeePhotoUrl', '');
      const bookedDuration = `${DateUtil.format(
        get(resourceSchedule, 'startDate', '')
      )}
        - ${DateUtil.format(get(resourceSchedule, 'endDate', ''))}`;

      const individualAssignment = resourceSchedule;
      const isLastElement = index === assignments.length - 1;

      const selectedAssignmentId = get(assignment, 'assignmentId', '');
      const isChecked = selectedAssignmentId === resourceSchedule.assignmentId;
      return (
        <div>
          <div className={`${ROOT}__field`} data-testid={`${ROOT}__roleTitle`}>
            <span className={`${ROOT}__resource-photo`}>
              <img
                onClick={() =>
                  props.openEmployeeCapabilityInfo(resourceSchedule.employeeId)
                }
                src={resourcePhotoUrl}
              />
              <div className={`${ROOT}__resource-name`}>
                <span className={`${ROOT}__resource-name__header`}>
                  {msg().Psa_Lbl_ResourceAssignee}
                </span>
                <a
                  onClick={() =>
                    props.openEmployeeCapabilityInfo(
                      resourceSchedule.employeeId
                    )
                  }
                >
                  {`${resourceName} - ${resourceCode}`}
                </a>
              </div>
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__booked-effort`}
          >
            <span className="label">{msg().Psa_Lbl_ScheduleBookedEffort}</span>
            <span className="value">
              {floorToOneDecimal(bookedHours / 60)} {msg().Psa_Lbl_Hours}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__show-schedule`}
          >
            <span className={`${ROOT}__show-schedule`}>
              <span className={`${ROOT}__schedule-icon`}>
                <ViewScheduleIcon />
              </span>
              <a
                onClick={() => onClickShowScheduleDetail(individualAssignment)}
              >
                {msg().Psa_Lbl_ViewScheduledDetails}
              </a>

              {props.selectedRole.status === RoleStatus.Scheduling &&
                props.currentRoute === CurrentRoute.Resource && (
                  <>
                    <span className={`${ROOT}__trash-icon`}>
                      <TrashIcon />
                    </span>
                    <a
                      onClick={() =>
                        props.releaseRoleResource(
                          resourceSchedule.assignmentId,
                          assignments
                        )
                      }
                    >
                      {msg().Psa_Lbl_AssignmentRemove}
                    </a>
                  </>
                )}
              {props.selectedRole.status === RoleStatus.SoftBooked &&
                props.canConfirmResource && (
                  <span className={`${ROOT}__resource-select-input`}>
                    {!isChecked && (
                      <input
                        className={`${ROOT}__resource-select-input__radio`}
                        id={''}
                        type="radio"
                        value={'test'}
                        checked={isChecked}
                        onChange={() => {
                          onSelectAssignment(individualAssignment);
                        }}
                      />
                    )}
                    {isChecked && <CheckActiveIcon />}

                    <label
                      className={`${ROOT}__resource-select-input__label ${
                        isChecked ? 'is-checked' : ''
                      }`}
                    >
                      {isChecked
                        ? msg().Psa_Lbl_Selected
                        : msg().Psa_Lbl_Select}
                    </label>
                  </span>
                )}
            </span>
          </div>

          <div
            className={`${ROOT}__field`}
            data-testid={`${ROOT}__bookedDuration`}
          >
            <span className="label">{msg().Psa_Lbl_BookedRoleDuration}</span>
            <span className="value">{bookedDuration}</span>
          </div>

          {individualAssignment.assignBy && (
            <div
              className={`${ROOT}__field`}
              data-testid={`${ROOT}__empty`}
            ></div>
          )}
          {individualAssignment.assignBy && (
            <div className={`${ROOT}__field`} data-testid={`${ROOT}__assignBy`}>
              <span className="label">{`Assigned By`}</span>
              <span className="value">{individualAssignment.assignBy}</span>
            </div>
          )}

          {!isLastElement && <div className={`${ROOT}__resource-separator`} />}
        </div>
      );
    });
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__header--schedule`}>
        {msg().Psa_Lbl_BookingInformation}
        {props.selectedRole.isDirectAssign && (
          <span className={`${ROOT}__direct-assign`}>
            {` (${msg().Psa_Lbl_PMDirectAssign})`}
          </span>
        )}
      </div>

      {assignments && assignments.length > 0 && (
        <div className={`${ROOT}__schedule`}>{renderScheduleDetails()}</div>
      )}
    </div>
  );
};

export default BookingInformation;
