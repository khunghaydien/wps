import {
  RequestListFilterState,
  RoleRequestListFilterState,
} from '@apps/domain/models/psa/Request';

export const formatDateRangeInFilter = (
  filterState: RequestListFilterState | RoleRequestListFilterState
): Record<string, any> => ({
  ...filterState,
  assignmentDueDateStart: formatEmptyDate(filterState.assignmentDueDate[0]),
  assignmentDueDateEnd: formatEmptyDate(filterState.assignmentDueDate[1]),
  receivedDateStart: formatEmptyDate(filterState.receivedDate[0]),
  receivedDateEnd: formatEmptyDate(filterState.receivedDate[1]),
  roleStartDateStart: formatEmptyDate(filterState.roleStartDate[0]),
  roleStartDateEnd: formatEmptyDate(filterState.roleStartDate[1]),
});

export const formatEmptyDate = (dateStr) => (dateStr === '' ? null : dateStr);
