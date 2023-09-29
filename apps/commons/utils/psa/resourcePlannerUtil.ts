import moment from 'moment';

import { RESOURCE_PLANNER_HEADER_VALUE } from '@apps/commons/components/psa/ResourcePlanner';
import { ROLE_DETAILS_HEADER_ITEM } from '@apps/commons/components/psa/RoleDetailsHeaderInfo/index';
import msg from '@apps/commons/languages/index';

import { ViewTypes } from '@apps/domain/models/psa/Resource';

import {
  RESOURCE_PLANNER_LIST_ITEM,
  RESOURCE_PLANNER_LIST_ITEM_FIRST_ROW,
  RESOURCE_PLANNER_LIST_ITEM_SECOND_ROW,
} from '../../components/psa/AvailabilityItem/index';
import { FILTER_RESULT_ITEM } from './../../components/psa/Filter/index';

/**
 * This function will generate the Array<string> which represent the column title
 * Based on the viewType, dynamically update the string format as well as date Format
 * @param viewType
 * @param startDate
 * @param isJapanLocale
 * @param size
 * @returns {Array}
 */
export const getDynamicScheduleColumnHeader = (
  viewType: string,
  startDate,
  isJapanLocale = false
): any[] => {
  const viewLimit = 12;
  let dynamicScheduleColumnHeader = [];
  if (viewType === ViewTypes.DAY) {
    dynamicScheduleColumnHeader = Array.from(Array(viewLimit)).map(
      (i, index) => {
        const day =
          index === 0 ? startDate : moment(startDate).add(index, 'days');
        let dayShortNameWithNumber;

        if (typeof day !== 'string') {
          dayShortNameWithNumber = day.format('ddd D');
          if (day.isSame(new Date(), 'day')) {
            dayShortNameWithNumber += ' today';
          } else if (day.day() === 6) {
            dayShortNameWithNumber += ' sat';
          } else if (day.day() === 0) {
            dayShortNameWithNumber += ' sun';
          }
        }

        return dayShortNameWithNumber;
      }
    );
  } else if (viewType === ViewTypes.WEEK) {
    dynamicScheduleColumnHeader = Array.from(Array(viewLimit)).map(
      (i, index) => {
        const day =
          index === 0 ? startDate : moment(startDate).add(index, 'week');
        let dayNumberWithMonth;
        if (typeof day !== 'string') {
          dayNumberWithMonth = isJapanLocale
            ? day.format('M/DD')
            : day.format('D MMM');
        }
        return dayNumberWithMonth;
      }
    );
  } else if (viewType === ViewTypes.MONTH) {
    dynamicScheduleColumnHeader = Array.from(Array(viewLimit)).map(
      (i, index) => {
        const day = index === 0 ? startDate : moment(startDate).add(index, 'M');
        let monthShortName;
        if (typeof day !== 'string') {
          monthShortName = isJapanLocale ? day.format('MM') : day.format('MMM');
        }

        return monthShortName;
      }
    );
  }
  return dynamicScheduleColumnHeader;
};

/**
 * This function will generate the Array<boolean> based on the viewType
 * For example : startDate = 1 Apr 2020, endDate = 10 Apr 2020, viewType = 'days'
 * @return [true,true,true,true,true,true,true,true,true,true,false,false]
 * @param viewType
 * @param startDate
 * @param endDate
 * @param size
 * @returns {Array}
 */
export const generateOutOfRangeArray = (
  viewType: string,
  currentStartDate,
  currentEndDate,
  startDate,
  endDate
) => {
  const viewLimit = 12;
  const outOfRangeArray = [];
  if (viewType === ViewTypes.DAY) {
    Array.from(Array(viewLimit)).forEach((i, index) => {
      const day =
        index === 0
          ? currentStartDate
          : moment(currentStartDate).add(index, 'days');

      const isOutOfRange = !moment(day).isBetween(
        startDate,
        endDate,
        'days',
        '[]'
      );
      outOfRangeArray.push(isOutOfRange);
    });
  } else if (viewType === ViewTypes.WEEK) {
    Array.from(Array(viewLimit)).forEach((i, index) => {
      const startDateOfWeek =
        index === 0
          ? currentStartDate
          : moment(currentStartDate).add(index, 'week');
      const endDateOfWeek = startDateOfWeek.clone().add(6, 'days');
      let day = index === 0 ? moment(startDate) : endDateOfWeek;
      if (index === 0 && day.isBefore(currentStartDate)) {
        day = currentStartDate;
      } else if (day.isAfter(endDate)) {
        day = endDate;
      }
      const isOutOfRange = !moment(day).isBetween(
        startDateOfWeek,
        endDateOfWeek,
        'days',
        '[]'
      );
      outOfRangeArray.push(isOutOfRange);
    });
  } else if (viewType === ViewTypes.MONTH) {
    const startDateOfCurrentMonth = moment(currentStartDate)
      .startOf('month')
      .format('YYYY-MM-DD');
    Array.from(Array(viewLimit)).forEach((i, index) => {
      const startDateOfMonth =
        index === 0
          ? moment(startDateOfCurrentMonth)
          : moment(startDateOfCurrentMonth).clone().add(index, 'M');
      const endDateOfMonth = startDateOfMonth.clone().endOf('month');
      // let day = index === 0 ? moment(currentStartDate) : moment(currentEndDate);
      let day = index === 0 ? moment(currentStartDate) : endDateOfMonth;
      if (day.isAfter(endDate)) {
        day = endDate;
      }
      const isOutOfRange = !moment(day).isBetween(
        startDateOfMonth,
        endDateOfMonth,
        'days',
        '[]'
      );
      outOfRangeArray.push(isOutOfRange);
    });
  }
  return outOfRangeArray;
};

/**
 * The purpose of this method is to slice the availability for array of default size (12)
 * @param pageParam
 * @param availability
 * @param viewType
 * @param nextStartDate
 * @param roleStartDate
 * @returns {
 *    limit: number,
 *    page: number,
 *    viewType: string,
 *    availableTime: array[number],
 *    startDate: string,
 *    endDate: string
 *}
 */
export const processView = (
  pageParam: number,
  availability: any,
  viewType: string,
  nextStartDate: string,
  roleStartDate: string
) => {
  // To support different type of viewLimit in future implementation
  // To support different type of viewLimit, accept the viewLimit as param and assign
  // viewLimit represents the number of columns to display
  const viewLimit = 12;
  let sliceLength = 1;
  let pageNumber = pageParam;
  let sliceArray = new Array(viewLimit).fill(1);

  // Based on the viewType, assign the sliceLength and sliceArray
  switch (viewType) {
    case ViewTypes.WEEK:
      sliceLength = 7;
      sliceArray = new Array(viewLimit).fill(7);
      break;
    case ViewTypes.MONTH:
      sliceLength = 31;
      const tempStartDate = nextStartDate || roleStartDate;
      sliceArray = Array.from(Array(12)).map((i, index) => {
        const day =
          index === 0
            ? moment(tempStartDate)
            : moment(tempStartDate).add(index, 'M');
        let daysInMonth = day.daysInMonth();

        // offset for the first month because startDate could be in the middle of the month
        // If startDate on 27 Jan, only count 5 (27 to 31 Jan) days for Jan.
        if (index === 0) {
          daysInMonth =
            moment(tempStartDate).daysInMonth() -
            +moment(tempStartDate).format('D') +
            1;
        }
        return daysInMonth;
      });
      sliceArray = sliceArray.slice(0, viewLimit);
      break;
    default:
      break;
  }

  // Re-adjust the pageNumber for corner cases
  // pageNumber should not be less than 0
  // pageNumber is not applicable if exceed the maximum possible pageNumber
  if (pageParam < 0) {
    pageNumber = 0;
  }

  // *** Calculate availableHours for day view ***
  const startIndex = pageNumber * sliceLength * viewLimit;
  const endIndex = startIndex + sliceLength * viewLimit;

  let availableHours = availability
    ? availability.map((hours) =>
        hours ? hours.slice(startIndex, endIndex) : new Array(1).fill(-1)
      )
    : [];
  // *** End of Calculate availableHours for day view ***

  if (
    availableHours.length > 0 &&
    (viewType === ViewTypes.WEEK || viewType === ViewTypes.MONTH)
  ) {
    const sanitizedArray = [];
    for (let j = 0; j < availableHours.length; j++) {
      if (
        availableHours[j].length <= 0 ||
        (availableHours[j].length === 1 && availableHours[j][0] === -1)
      ) {
        sanitizedArray.push(new Array(viewLimit).fill(-1));
      } else {
        const tempAvailableHours = new Array(viewLimit);
        let tempSlice = [];
        let dynamicStartIndex = 0;
        for (let i = 0; i < sliceArray.length; i++) {
          const sliceStart = dynamicStartIndex;
          const sliceEnd = sliceStart + sliceArray[i];
          dynamicStartIndex = sliceEnd;

          tempSlice = availableHours[j].slice(sliceStart, sliceEnd);

          // check if all elements has -1 value
          let allMinusOne = true;
          let allMinus = true;
          tempSlice.forEach((x) => {
            if (x !== -1) {
              allMinusOne = false;
            }
            if (x > 0) {
              allMinus = false;
            }
          });
          if (allMinusOne) {
            tempAvailableHours[i] = -1;
          } else if (allMinus) {
            // if value is -1, assign as zero for the correct summation
            tempSlice = tempSlice.map((hour) => (hour === -1 ? 0 : hour));
            const sum = tempSlice.reduce((a, b) => {
              return a + b;
            }, 0);
            tempAvailableHours[i] = sum;
          } else {
            // if value is -1, assign as zero for the correct summation
            tempSlice = tempSlice.map((hour) => (hour <= -1 ? 0 : hour));
            const sum = tempSlice.reduce((a, b) => {
              return a + b;
            }, 0);
            tempAvailableHours[i] = sum;
          }
        }
        sanitizedArray.push(tempAvailableHours);
      }
    }
    availableHours = sanitizedArray;
  }
  // Filling with trailing zero if the array length is less than viewLimit
  // Trim the array if the array length is more than viewLimit
  // @ts-ignore
  availableHours = availableHours.map<any>((hours) => {
    if (hours.length < viewLimit) {
      return hours.concat(new Array(viewLimit - hours.length).fill(-1));
    }
    if (hours.length > viewLimit) {
      return hours.slice(0, viewLimit);
    }

    return hours;
  });

  return {
    limit: viewLimit,
    page: pageNumber,
    viewType,
    availableHours,
    startDate: nextStartDate,
    endDate: '',
  };
};

/**
 * Compare and sort by code
 * Default is ascending order
 * @param a
 * @param b
 */
export const sortByCode = (a, b) => {
  let comparison = 0;

  if (a.code > b.code) {
    comparison = 1;
  } else if (a.code < b.code) {
    comparison = -1;
  }
  return comparison;
};

export const getAdjustedDate = (
  customHours: Array<number>,
  startDate: string
) => {
  let startIndex = 0;
  let endIndex = 0;
  if (!customHours) {
    return {};
  }

  for (let i = 0; i < customHours.length; i++) {
    if (customHours[i] !== -1 && customHours[i] !== 0) {
      startIndex = i;
      break;
    }
  }
  for (let j = customHours.length - 1; j >= 0; j--) {
    if (customHours[j] !== -1 && customHours[j] !== 0) {
      endIndex = j;
      break;
    }
  }
  const adjustedStartDate = moment(startDate).add(startIndex, 'days');
  const adjustedEndDate = moment(adjustedStartDate).add(
    endIndex - startIndex,
    'days'
  );

  return {
    adjustedStartDate: adjustedStartDate.format('YYYY-MM-DD'),
    adjustedEndDate: adjustedEndDate.format('YYYY-MM-DD'),
  };
};

export const floorToOneDecimal = (originalNumber: number) => {
  return Math.floor(originalNumber * 10) / 10;
};

/**
 * This function will generate an array of array that is converted to csv for download. Currently, it only downloads the current selected view. The array at first index is the header.
 * @returns {Array}
 */
export const downloadCurrentViewAsCSV = (viewType: string) => {
  const availabilityArray = [];
  const header = [
    msg().Com_Lbl_EmployeeName,
    msg().Com_Lbl_EmployeeCode,
    msg().Admin_Lbl_Department,
    msg().Admin_Lbl_JobGrade,
    msg().Psa_Lbl_AvailableHours,
  ];

  // get role details values:
  document
    .querySelectorAll(`.${ROLE_DETAILS_HEADER_ITEM}`)
    .forEach((node: HTMLElement) => {
      const [label, value] = node.textContent.split(':');
      const isDescription = node.className.includes('remarks');
      const content = isDescription ? '"' + value + '"' : value;

      availabilityArray.push([label, content]);
    });

  // add an empty row
  availabilityArray.push(['', '']);

  // get filter values
  document
    .querySelectorAll(`.${FILTER_RESULT_ITEM}`)
    .forEach((node: HTMLElement) => {
      const [filterLabel, filterValue] = node.textContent.split(':');
      availabilityArray.push([filterLabel, filterValue]);
    });

  // add an empty row
  availabilityArray.push(['', '']);

  // get header values
  document
    .querySelectorAll(`.${RESOURCE_PLANNER_HEADER_VALUE}`)
    .forEach((node: HTMLElement) => {
      const headerValue = node.innerText.split('\n').join(' ');
      header.push(headerValue);
    });

  availabilityArray.push(header);

  document
    .querySelectorAll(`.${RESOURCE_PLANNER_LIST_ITEM}.is-selectable`)
    .forEach((node: HTMLElement) => {
      const content = [];
      const [empName, empCode] = node
        .querySelector(`.${RESOURCE_PLANNER_LIST_ITEM_FIRST_ROW}`)
        .textContent.split('-');
      const [deptName, jobGrade = ''] = node
        .querySelector(`.${RESOURCE_PLANNER_LIST_ITEM_SECOND_ROW}`)
        .textContent.split('-');

      const valueNode: HTMLElement = node.querySelector(
        `.ts-psa__resource-planner__resource-list-item__values`
      );
      const valuesArray = valueNode.innerText.split('\n');
      content.push(empName, empCode, deptName, jobGrade, ...valuesArray);

      availabilityArray.push(content);
    });

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    availabilityArray.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);

  // Create a new link to download
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `MatchingList (${viewType}).csv`);
  document.body.appendChild(link); // Required for FF

  link.click();
  link.remove();
};
