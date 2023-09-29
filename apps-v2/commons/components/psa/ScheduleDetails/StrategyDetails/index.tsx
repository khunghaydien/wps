import React from 'react';

import { checkChanged } from '@apps/commons/components/psa/StrategyForm';
import msg from '@apps/commons/languages/index';
import DateUtil from '@apps/commons/utils/DateUtil';
import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { StrategyOptions } from '@apps/domain/models/psa/PsaResourceSchedule';
import { Role } from '@apps/domain/models/psa/Role';

import './index.scss';

const ROOT = 'ts-psa__schedule-details__strategy-details';

type Props = {
  isOmitFields: boolean;
  selectedRole: Role;
};

const StrategyDetails = ({ selectedRole, isOmitFields = false }: Props) => {
  const strategy = StrategyOptions()
    .filter(
      (options) =>
        options.value === selectedRole.assignment.strategy.schedulingStrategy
    )
    .map((selectedOption) => selectedOption.label);

  const workHoursPerDay =
    +selectedRole.assignment.strategy.scheduledTimePerDay / 60;
  return (
    <div className={`${ROOT}__schedule-strategy-form`}>
      <div className={`${ROOT}__schedule-strategy-form-header`}>
        {msg().Psa_Lbl_ScheduleStrategyDetails}
      </div>
      <div className={`${ROOT}__schedule-strategy-form-body`}>
        <div className={`${ROOT}__schedule-strategy-form-body__row`}>
          {!isOmitFields && (
            <div className={`${ROOT}__schedule-strategy-form-body__dropdown`}>
              <span className="label">{msg().Psa_Lbl_Strategy}</span>
              <input
                disabled
                className="value"
                value={strategy}
                data-testid={`${ROOT}__schedule-strategy-details__strategy`}
              />
            </div>
          )}
          <div className={`${ROOT}__schedule-strategy-form-body__dropdown`}>
            <span className="label">
              {msg().Psa_Lbl_WorkHoursPerDaySettings}
            </span>
            <input
              disabled
              className="value"
              value={`${workHoursPerDay} ${msg().Psa_Lbl_HoursPerDay}`}
              data-testid={`${ROOT}__schedule-strategy-details__work-hours-per-day`}
            />
          </div>
        </div>
        <div className={`${ROOT}__schedule-strategy-form-body__row`}>
          {!isOmitFields && (
            <div className={`${ROOT}__schedule-strategy-form-body__field`}>
              <span className="label">
                {msg().Psa_Lbl_StrategyRequiredEffort}
              </span>
              <input
                className="value"
                value={`${floorToOneDecimal(+selectedRole.requiredTime / 60)} ${
                  msg().Psa_Lbl_Hours
                }`}
                disabled
                data-testid={`${ROOT}__schedule-strategy-details__required-effort`}
              />
            </div>
          )}
          <div
            className={`${ROOT}__schedule-strategy-form-body__field ${checkChanged(
              selectedRole.assignment.startDate,
              selectedRole.startDate
            )}`}
          >
            <span className="label">{msg().Psa_Lbl_StartDate}</span>
            <input
              className="value"
              value={
                selectedRole.assignment.startDate
                  ? DateUtil.format(selectedRole.assignment.startDate)
                  : DateUtil.format(selectedRole.startDate)
              }
              disabled
              data-testid={`${ROOT}__schedule-strategy-details__field__scheduled-start-date`}
            />
          </div>
          <div
            className={`${ROOT}__schedule-strategy-form-body__field ${checkChanged(
              selectedRole.assignment.endDate,
              selectedRole.endDate
            )}`}
          >
            <span className="label">{msg().Psa_Lbl_EndDate}</span>
            <input
              className="value"
              value={
                selectedRole.assignment.endDate
                  ? DateUtil.format(selectedRole.assignment.endDate)
                  : DateUtil.format(selectedRole.endDate)
              }
              disabled
              data-testid={`${ROOT}__schedule-strategy-details__field__scheduled-end-date`}
            />
          </div>
          <div
            className={`${ROOT}__schedule-strategy-form-body__field ${checkChanged(
              selectedRole.assignment.strategy.bookedEffort,
              selectedRole.requiredTime
            )}`}
          >
            <span className="label">{msg().Psa_Lbl_BookedEffort}</span>
            <input
              className="value"
              value={`${floorToOneDecimal(
                +selectedRole.assignment.strategy.bookedEffort / 60
              )} ${msg().Psa_Lbl_Hours}`}
              disabled
              data-testid={`${ROOT}__schedule-strategy-details__field__booked-effort`}
            />
          </div>
        </div>
      </div>
      <div className={`${ROOT}__schedule-strategy-form-footer`} />
    </div>
  );
};

export default StrategyDetails;
