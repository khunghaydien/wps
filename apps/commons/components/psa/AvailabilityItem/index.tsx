import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import IconButton from '@apps/commons/components/buttons/IconButton';
import IconExpandClose from '@apps/commons/images/icons/iconExpandClose.svg';
import { floorToOneDecimal } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { ResourceListItem } from '@apps/domain/models/psa/Resource';
import RejectedTag from '@apps/commons/components/psa/RejectedTag';

import { ResourceSelectionState } from '@resource/modules/ui/resourceSelection';

import './index.scss';

type Props = {
  assignmentStatus?: string;
  availableHours?: Array<Array<number>>;
  className?: string;
  currentDateIndicator?: Array<boolean>;
  fetchAssignmentDetailList?: (employeebaseId: string) => void;
  hasExtraMargin?: boolean;
  hideTotalHours?: boolean;
  index: number;
  isExpandable?: boolean;
  isExpandableDisabled?: boolean;
  isExpanded?: boolean;
  isScheduled?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onClickResourceItem?: (
    current: string,
    index: number,
    resourceListItem: ResourceListItem
  ) => void;
  openEmployeeCapabilityInfo?: (empId: string) => void;
  outOfRangeArray: Array<boolean>;
  resource?: ResourceListItem;
  testId: string;
  toggleExpand?: () => void;
  totalAvailableHours: number;
  isFetching?: boolean;
  isFetchingOthers?: boolean;
};

const ROOT = 'ts-psa__resource-planner__resource-list-item';
export const RESOURCE_PLANNER_LIST_ITEM = ROOT;
export const RESOURCE_PLANNER_LIST_ITEM_FIRST_ROW = `${ROOT}__resource-item-info__first-row`;
export const RESOURCE_PLANNER_LIST_ITEM_SECOND_ROW = `${ROOT}__resource-item-info__second-row`;
export const RESOURCE_PLANNER_LIST_ITEM_VALUES = `${ROOT}__values`;

const AvailabilityItem = (props: Props) => {
  const { resource, assignmentStatus } = props;
  const isNonProject = assignmentStatus === '-';

  const EMPLOYEE_NAME_CLASS = `${ROOT}__name-onclick`;
  const EMPLOYEE_IMAGE_CLASS = `${ROOT}__photo-onclick`;
  const ASSIGNMENT_DETAIL_CLASS = `${ROOT}__show-assignment-details-btn`;

  const bottomMargin = {
    marginTop: props.hasExtraMargin ? 10 : 1,
  };

  let firstColumnColor = classNames({
    'is-scheduled': props.isScheduled,
    'is-selected': props.isSelected && !props.isExpandableDisabled,
    'is-non-daily-hour': !props.isScheduled && !props.isSelected,
  });

  const isExpandedClass =
    props.isExpanded && !props.isExpandableDisabled ? 'is-expanded' : '';
  const isDisabledBtnClass = props.isExpandableDisabled ? 'is-disabled' : '';
  if (props.isExpandable && !props.isExpanded) {
    firstColumnColor = 'is-non-daily-hour';
  }

  const onclickToggleExpand = () => {
    if (!props.isFetchingOthers) {
      if (
        props.resource &&
        !props.isExpanded &&
        props.fetchAssignmentDetailList &&
        props.toggleExpand
      ) {
        props.fetchAssignmentDetailList(props.resource.id);
      }
      props.toggleExpand();
    }
  };

  const onClickOpenEmployeeCapability = () => {
    if (props.openEmployeeCapabilityInfo && resource && resource.id) {
      props.openEmployeeCapabilityInfo(resource.id);
    }
  };

  const onClickResourceItem = (e: any) => {
    const target = e.target as HTMLTextAreaElement;
    if (
      target.className &&
      typeof target.className === 'string' &&
      !target.className.includes(EMPLOYEE_NAME_CLASS) &&
      !target.className.includes(EMPLOYEE_IMAGE_CLASS) &&
      !target.className.includes(ASSIGNMENT_DETAIL_CLASS) &&
      props.isSelectable &&
      props.onClickResourceItem &&
      props.resource
    ) {
      props.onClickResourceItem(
        ResourceSelectionState.SELECT_STRATEGY,
        props.index,
        props.resource
      );
    }
  };

  let resourceNameAndCode = get(resource, 'name', '');
  if (resource && resource.code) {
    resourceNameAndCode += ` - ${resource.code}`;
  }

  // lodash 'get' does not work here because it still return the null value
  let resourceDepartmentNameAndJobGrade =
    resource && resource.departmentName ? resource.departmentName : '';
  if (resource && resource.jobGradeName) {
    if (resource && resource.departmentName) {
      resourceDepartmentNameAndJobGrade += ' - ';
    }
    resourceDepartmentNameAndJobGrade += `${resource.jobGradeName}`;
  }

  const renderFirstColumn = (
    <div className={`${ROOT}__first-column`}>
      {props.isExpandable && (
        <div className={`${ROOT}__show-assignment-details ${isExpandedClass}`}>
          {!props.isFetching ? (
            <IconButton
              className={`${ASSIGNMENT_DETAIL_CLASS} ${isDisabledBtnClass}`}
              data-testid={`${ROOT}--show-assignment-details-btn`}
              srcType={'svg'}
              fillColor="#666666"
              src={IconExpandClose}
              onClick={onclickToggleExpand}
              disabled={props.isExpandableDisabled}
            />
          ) : (
            <div className={ASSIGNMENT_DETAIL_CLASS}>
              <div role="status" className="slds-spinner slds-spinner--small">
                <div className="slds-spinner__dot-a" />
                <div className="slds-spinner__dot-b" />
              </div>
            </div>
          )}
        </div>
      )}
      {props.openEmployeeCapabilityInfo && (
        <div className={`${ROOT}__resources__photo`}>
          <img
            className={EMPLOYEE_IMAGE_CLASS}
            onClick={onClickOpenEmployeeCapability}
            src={resource && resource.photoUrl ? resource.photoUrl : ''}
          />
        </div>
      )}

      <div className={`${ROOT}__resource-item-info`}>
        <span className={RESOURCE_PLANNER_LIST_ITEM_FIRST_ROW}>
          {props.openEmployeeCapabilityInfo ? (
            <a
              className={EMPLOYEE_NAME_CLASS}
              onClick={onClickOpenEmployeeCapability}
            >
              {resourceNameAndCode}
            </a>
          ) : (
            <p>{resourceNameAndCode}</p>
          )}
        </span>
        <span className={RESOURCE_PLANNER_LIST_ITEM_SECOND_ROW}>
          {resourceDepartmentNameAndJobGrade}
        </span>
        {resource && resource.rejectedBefore && <RejectedTag></RejectedTag>}
      </div>
    </div>
  );

  return (
    <div
      className={`${ROOT} ${props.isSelectable ? 'is-selectable' : ''} ${
        props.className
      } ${props.isExpanded ? 'js-is-expanded' : ''}`}
      style={bottomMargin}
      data-testid={props.testId}
      onClick={(e) => onClickResourceItem(e)}
    >
      <div className={`${ROOT}__resources ${firstColumnColor}`}>
        {renderFirstColumn}
      </div>
      <div className={RESOURCE_PLANNER_LIST_ITEM_VALUES}>
        {!props.hideTotalHours && (
          <div className={`${ROOT}__total-hours ${firstColumnColor}`}>
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
              const isFullyBooked = hour === 0;
              let hourDisplay = hour;
              if (hour && hour > 0) {
                hourDisplay = minutes / 60;
              }
              if (!isNaN(hourDisplay)) {
                hourDisplay = floorToOneDecimal(hourDisplay);
              }
              const colorCSS = classNames({
                'is-outOfRange': isOutOfRange,
                'is-overBooked': minutes < -1,
                'is-notAvailable': isFullyBooked && !isOutOfRange,
                'is-available': minutes > 0,
              });

              return (
                <span
                  key={index}
                  className={`${ROOT}__background ${isToday && 'is-today'}`}
                >
                  <span className={`${ROOT}__value ${colorCSS}`}>
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

export default AvailabilityItem;
