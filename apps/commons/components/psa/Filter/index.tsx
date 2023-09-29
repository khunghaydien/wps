import React, { useEffect, useState } from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import get from 'lodash/get';
import moment from 'moment';

import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { ProjectListFilterState } from '../../../../domain/models/psa/Project';
import {
  RequestListFilterState,
  ResourceSelectionFilterState,
  RoleRequestListFilterState,
} from '../../../../domain/models/psa/Request';

import FilterIcon from '../../../images/icons/filter.svg';
import msg from '../../../languages';
import Button from '../../buttons/Button';
import IconButton from '../../buttons/IconButton';
import { mapSkillWithCommas } from '../SkillSelectionField/SkillNameHelper';

import './index.scss';

type Props = {
  children: any;
  displayState?: any;
  deptSuggestList?: Array<any>;
  enabledFilters?: any;
  initialFilterState:
    | RequestListFilterState
    | RoleRequestListFilterState
    | ResourceSelectionFilterState
    | ProjectListFilterState;
  maxSelectableDate?: string;
  minSelectableDate?: string;
  reduxState: Record<string, any>;
  // allow mapping of key to corresponding translations
  /* eslint-disable react/no-unused-prop-types */
  filterResultsLabel?: Record<string, any>;
  /* eslint-enable react/no-unused-prop-types */
  shouldChangeWhenInitialStateChanges?: boolean;
  updateReduxState: (nextState: Record<string, any>) => void;
};

const ROOT = 'ts-psa__common-filter';
export const FILTER_RESULT_ITEM = `${ROOT}__result`;

const Filter = (props: Props) => {
  // init initial filter state from initial state
  const [filterResults, setFilter] = useState(props.reduxState);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isResetted, setResetState] = useState(false);
  const [doRefresh, setDoRefresh] = useState(0);

  useEffect(() => {
    if (props.shouldChangeWhenInitialStateChanges) {
      setFilter(props.reduxState);
    }
  }, [props.reduxState]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.className = 'body_scroll_disable';
    } else {
      document.body.className = null;
    }
  }, [isFilterOpen]);

  useEffect(() => {
    setFilter(props.reduxState);
  }, [props.reduxState]);

  const updateFilterObj = (filterObj: any) => {
    const newFilterResults = {
      ...filterResults,
      ...filterObj,
    };
    setFilter(newFilterResults);
    setResetState(false);
  };

  const updateFilter = (filter, value) => {
    let newFilterResults;
    if (filter === 'startDate' || filter === 'endDate') {
      newFilterResults = {
        ...filterResults,
        isDateFilterNotApplied: false,
        [filter]: value,
      };
    } else {
      newFilterResults = {
        ...filterResults,
        [filter]: value,
      };
    }
    setFilter(newFilterResults);
    setResetState(false);
  };

  const toggleFilterOpen = () => {
    setFilterOpen(!isFilterOpen);
  };

  const resetFilter = () => {
    setFilter(props.initialFilterState);
    setResetState(true);
    setDoRefresh(doRefresh + 1);
  };

  const cancelAndCloseFilter = () => {
    setFilter(props.reduxState);
    toggleFilterOpen();
  };

  const saveAndCloseFilter = () => {
    props.updateReduxState(filterResults);
    toggleFilterOpen();
  };

  const processFilterResult = (filterValues: any, key: string) => {
    const currentFilterValue = filterValues[key];
    let result = currentFilterValue;
    let resultLabel = '';
    const isSkills = key === 'skills';
    const isJobId = key === 'jobId' || key === 'projectJobId';
    const isDeptId = key === 'deptId';
    const isJobGradeIds = key === 'jobGradeIds';
    const isArray = Array.isArray(currentFilterValue);
    const isDateFilterNotApplied = key === 'isDateFilterNotApplied';
    const isStartDate = key === 'startDate';
    const isEndDate = key === 'endDate';
    // currently Date is used for date range filters
    const isDateRange = key.endsWith('Date');
    if (props.filterResultsLabel) {
      resultLabel = `${props.filterResultsLabel[key]}: `;
    }

    if (isDateFilterNotApplied) {
      return null;
    }

    if (isDateRange && isArray) {
      // date range filter format is Array(2)
      const [start, end] = currentFilterValue;
      const startDate = start && DateUtil.format(start);
      const endDate = end && DateUtil.format(end);
      if (startDate && endDate) {
        result = `${startDate} - ${endDate}`;
      } else if (startDate) {
        result = TextUtil.template(msg().Psa_Lbl_DateRangeAfter, startDate);
      } else if (endDate) {
        result = TextUtil.template(msg().Psa_Lbl_DateRangeBefore, endDate);
      } else {
        return null;
      }
    }

    if (isDateFilterNotApplied) {
      return null;
    }

    if (isDeptId) {
      const deptDisplayNameArray = props.deptSuggestList.filter(
        (_) => _.id === currentFilterValue
      );
      const deptCode = get(deptDisplayNameArray, '0.code', '');
      const deptName = get(deptDisplayNameArray, '0.name', '');
      const deptDisplayName = deptCode ? `${deptName} - ${deptCode}` : '';

      result = deptDisplayName;
    }

    // Don't display jobId
    if (isJobId) {
      return null;
    } else if (isSkills) {
      if (!currentFilterValue.length) {
        return null;
      }
      const hasNextElement = currentFilterValue.filter((e) => !e.deleted);
      result = hasNextElement.map(mapSkillWithCommas);
    } else if (isJobGradeIds && isArray) {
      if (!currentFilterValue.length) {
        return null;
      }

      result = currentFilterValue.map((jobGrade) => jobGrade.label).join(', ');
    } else if (isArray && !isSkills && !isDateRange) {
      if (!currentFilterValue.length) {
        return null;
      }

      result = currentFilterValue.reduce((accumulator, currentValue, i) => {
        const separator = i === 0 ? '' : ', ';
        const formattedResult =
          accumulator + separator + msg()[`Psa_Lbl_Status${currentValue}`];
        return formattedResult;
      }, '');
    }
    if (
      isStartDate &&
      !(props.enabledFilters && props.enabledFilters.startDate)
    ) {
      return null;
    }
    if (isEndDate && !(props.enabledFilters && props.enabledFilters.endDate)) {
      return null;
    }

    return (
      currentFilterValue && (
        <div className={`${FILTER_RESULT_ITEM} filter-result--${key}`}>
          <span className={`${ROOT}__result-label`}>{resultLabel}</span>
          {result}
        </div>
      )
    );
  };

  const isDateRangeValid =
    filterResults.endDate &&
    filterResults.startDate &&
    (!moment(filterResults.endDate).isAfter(moment(filterResults.startDate)) ||
      moment(props.maxSelectableDate).isBefore(moment(filterResults.endDate)) ||
      moment(props.minSelectableDate).isAfter(moment(filterResults.startDate)));

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__outside`}>
        <IconButton
          srcType="svg"
          fillColor="#2782ED"
          src={FilterIcon}
          className={`${ROOT}__trigger`}
          data-testid={`${ROOT}__trigger`}
          onClick={toggleFilterOpen}
        />
        <div className={`${ROOT}__results`} data-testid={`${ROOT}__results`}>
          {props.displayState
            ? Object.keys(props.displayState).map((key) =>
                processFilterResult(props.displayState, key)
              )
            : Object.keys(filterResults).map((key) =>
                processFilterResult(filterResults, key)
              )}
        </div>
      </div>

      <ReactCSSTransitionGroup
        in={isFilterOpen}
        timeout={{ enter: 300, exit: 500 }}
        classNames={`${ROOT}__animate`}
        exit={true}
        unmountOnExit
      >
        <div className={`${ROOT}__inside`} data-testid={`${ROOT}__inside`}>
          <div className={`${ROOT}__inside-content`}>
            <div className={`${ROOT}__header`}>
              <div className={`${ROOT}__header-title`}>
                {msg().Psa_Lbl_Filters}
              </div>
              <div className={`${ROOT}__header-buttons`}>
                <Button
                  className={`${ROOT}__reset`}
                  data-testid={`${ROOT}__reset`}
                  onClick={resetFilter}
                >
                  {msg().Psa_Lbl_Reset}
                </Button>
                <Button
                  type="default"
                  onClick={cancelAndCloseFilter}
                  className={`${ROOT}__cancel`}
                  data-testid={`${ROOT}__cancel`}
                >
                  {msg().Psa_Btn_Cancel}
                </Button>
                <Button
                  className={`${ROOT}__apply`}
                  disabled={isDateRangeValid}
                  data-testid={`${ROOT}__apply`}
                  onClick={saveAndCloseFilter}
                  type="primary"
                >
                  {msg().Admin_Lbl_Apply}
                </Button>
              </div>
            </div>
            {props.children(
              filterResults,
              updateFilter,
              isResetted,
              updateFilterObj,
              doRefresh
            )}
          </div>
        </div>
      </ReactCSSTransitionGroup>
    </div>
  );
};

export default Filter;
