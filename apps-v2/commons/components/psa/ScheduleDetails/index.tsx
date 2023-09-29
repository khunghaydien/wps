import React from 'react';

import get from 'lodash/get';
import has from 'lodash/has';
import moment from 'moment';

import BookedHourItem from '@apps/commons/components/psa/BookedHourItem';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import RoleDetailsHeaderInfo from '@apps/commons/components/psa/RoleDetailsHeaderInfo';
import StrategyDetails from '@apps/commons/components/psa/ScheduleDetails/StrategyDetails';
import ViewSelector from '@apps/commons/components/psa/ViewSelector';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import {
  generateOutOfRangeArray,
  getDynamicScheduleColumnHeader,
} from '@apps/commons/utils/psa/resourcePlannerUtil';

import { ViewTypes } from '@apps/domain/models/psa/Resource';
import { Role } from '@apps/domain/models/psa/Role';

import { ResourceAvailabilityUIState } from '@resource/modules/ui/resourceAvailability';
import { ResourceSelectionState } from '@resource/modules/ui/resourceSelection';

import './index.scss';

type Props = {
  isOmitFields?: boolean;
  resourceAvailability: ResourceAvailabilityUIState;
  selectedRole: Role;
  selectView: (page: number, view: string, date: string) => void;
};

const ROOT = 'ts-psa__schedule-details';

const ScheduleDetails = (props: Props) => {
  const { resourceAvailability, isOmitFields = false } = props;
  const { page, viewType, availableHours } = resourceAvailability;

  let currentStartDate: any = resourceAvailability.startDate
    ? moment(resourceAvailability.startDate)
    : moment(get(props.selectedRole, 'assignment.startDate', ''));
  let currentEndDate: any = currentStartDate
    .clone()
    .add(11, `${resourceAvailability.viewType}s`)
    .format('YYYY-MM-DD');
  // @ts-ignore
  const isJapanLocale = window.empInfo.language === 'ja';
  const dynamicDateHeader = getDynamicScheduleColumnHeader(
    resourceAvailability.viewType,
    currentStartDate,
    isJapanLocale
  );
  const outOfRangeArray =
    props.selectedRole.assignment &&
    generateOutOfRangeArray(
      resourceAvailability.viewType,
      currentStartDate,
      currentEndDate,
      moment(props.selectedRole.assignment.startDate),
      moment(props.selectedRole.assignment.endDate)
    );
  // To display the duration, need to reassign the endDate for week view and month view
  if (resourceAvailability.viewType === ViewTypes.WEEK) {
    currentEndDate = moment(currentEndDate).add(6, 'days');
  } else if (resourceAvailability.viewType === ViewTypes.MONTH) {
    // Only update for month because month view always start from the first day.
    currentStartDate = moment(currentStartDate).startOf('month');
    currentEndDate = moment(currentEndDate).endOf('month');
  }

  const customDateFormat = isJapanLocale ? 'YYYY/MM/DD' : 'DD MMM YYYY';
  const viewDuration = `${DateUtil.customFormat(
    currentStartDate,
    customDateFormat
  )}
  - ${DateUtil.customFormat(currentEndDate, customDateFormat)}`;

  let scheduledEndDate = props.selectedRole.endDate;
  if (
    props.selectedRole.assignment &&
    props.selectedRole.assignment.endDate &&
    moment(props.selectedRole.assignment.endDate).isAfter(
      props.selectedRole.endDate,
      'day'
    )
  ) {
    scheduledEndDate = props.selectedRole.assignment.endDate;
  }

  return (
    <div className={`${ROOT}`}>
      <PSACommonHeader isOmitFields={props.isOmitFields} title={viewDuration}>
        <ViewSelector
          endDate={scheduledEndDate}
          page={page}
          resourceSelectionState={ResourceSelectionState.STRATEGY_PREVIEW}
          selectView={props.selectView}
          startDate={
            resourceAvailability.startDate
              ? resourceAvailability.startDate
              : get(props.selectedRole, 'assignment.startDate', '')
          }
          viewType={viewType}
        />
      </PSACommonHeader>
      <RoleDetailsHeaderInfo
        isOmitFields={isOmitFields}
        selectedRole={props.selectedRole}
      />
      <div className={`${ROOT}__content-container`}>
        <div className={`${ROOT}__schedule-container`}>
          <div className={`${ROOT}__schedule-header`}>
            <div className={`${ROOT}__schedule-header__first-column`} />
            <div className={`${ROOT}__schedule-header__values`}>
              <div className={`${ROOT}__schedule-header__total-hours`}>
                {msg().Psa_Lbl_TotalHours}
              </div>
              {dynamicDateHeader.map((dateString) => {
                const formattedDateString = dateString.split(' ');
                const [dayName, dayNum] = formattedDateString;
                const lastArrayValue = formattedDateString.pop();

                let customClass = ``;

                if (lastArrayValue === 'today') {
                  customClass = 'js-is-today';
                } else if (lastArrayValue === 'sat') {
                  customClass = 'js-is-sat';
                } else if (lastArrayValue === 'sun') {
                  customClass = 'js-is-sun';
                }

                return (
                  <span
                    className={`${ROOT}__schedule-header__value ${customClass}`}
                  >
                    <span className={`${ROOT}__schedule-dayname`}>
                      {dayName}
                    </span>
                    <span className={`${ROOT}__schedule-daynum`}>{dayNum}</span>
                  </span>
                );
              })}
            </div>
          </div>
          <div className={`${ROOT}__schedule-body`}>
            {availableHours.length > 0 && props.selectedRole.assignment && (
              <BookedHourItem
                activityTitle={props.selectedRole.assignment.activityTitle}
                assignmentStatus={props.selectedRole.status}
                availableHours={[availableHours[0]]}
                outOfRangeArray={outOfRangeArray}
                projectTitle={props.selectedRole.assignment.projectTitle}
                testId={`${ROOT}__booked-schedule`}
                totalAvailableHours={
                  has(props.selectedRole, 'assignment.bookedTimePerDay') &&
                  props.selectedRole.assignment.bookedTimePerDay
                    ? props.selectedRole.assignment.bookedTimePerDay.reduce(
                        (accumulator, currentValue) =>
                          accumulator + (currentValue === -1 ? 0 : currentValue)
                      )
                    : 0
                }
              />
            )}
          </div>
        </div>
        {props.selectedRole.assignment ? (
          <StrategyDetails
            isOmitFields={isOmitFields}
            selectedRole={props.selectedRole}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ScheduleDetails;
