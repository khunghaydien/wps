import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import ArrowLeft from '@apps/commons/images/arrowLeft.svg';
import ArrowRight from '@apps/commons/images/arrowRight.svg';
import CalendarIcon from '@apps/commons/images/icons/calendar.svg';
import msg from '@apps/commons/languages';
import DateField from '@commons/components/fields/DateField';

import { ViewTypes } from '@apps/domain/models/psa/Resource';

import { ResourceSelectionState } from '@resource/modules/ui/resourceSelection';

import './index.scss';

const ROOT = 'ts-psa__resource-planner__view-selector';

type Props = {
  endDate: string;
  isDateFilterNotApplied?: boolean;
  isMonthViewDisabled?: boolean;
  isMoveToTargetDateEnabled?: boolean;
  isWeekViewDisabled?: boolean;
  page: number;
  reduxFilterState?: any;
  resourceSelectionState: string;
  scheduledEndDate?: string;
  selectScheduledView?: (
    nextPage: number,
    viewType: string,
    nextStartDate: string
  ) => void;
  selectView: (
    nextPage: number,
    viewType: string,
    nextStartDate: string
  ) => void;
  startDate: any;
  updateScheduledViewType?: (mode: string, pageNum: number) => void;
  viewType: string;
};

const ResourcePlannerViewSelector = (props: Props) => {
  const todayDateString = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  // requireMoveToToday is to decide for the first time only
  // no need to trigger when moving around
  const [requireMoveToToday, setRequireMoveToToday] = useState(true);
  const startOfMonth = moment().format('YYYY-MM-01');
  const endOfNextYearNextMonth = moment()
    .clone()
    .add(12, 'months')
    .endOf('month');
  // viewType dynamically updates the current display state
  const isViewSelected = (viewType: string) =>
    viewType === props.viewType ? 'is-active' : '';
  const nextStartDate = moment(props.startDate)
    .clone()
    .add(12 as any, `${props.viewType}s`)
    .format('YYYY-MM-DD');
  const prevStartDate = moment(props.startDate)
    .clone()
    .subtract(12 as any, `${props.viewType}s`)
    .format('YYYY-MM-DD');
  const isStrategyPreviewState =
    props.resourceSelectionState === ResourceSelectionState.STRATEGY_PREVIEW;
  const isCustomScheduleState =
    props.resourceSelectionState === ResourceSelectionState.CUSTOM_SCHEDULE;
  const isCustomSchedulePreview =
    props.resourceSelectionState === ResourceSelectionState.CUSTOM_PREVIEW;

  // [Start] Process previous and next window availability
  const isPrevWindowAvailable = props.page > 0;
  let isNextWindowAvailable = true;

  if (moment(nextStartDate).isAfter(moment(props.endDate))) {
    isNextWindowAvailable = false;
  }
  if (
    isStrategyPreviewState &&
    props.scheduledEndDate &&
    moment(nextStartDate).isAfter(moment(props.scheduledEndDate))
  ) {
    isNextWindowAvailable = false;
  }

  // Exception for month view. Re-process isNextWindowAvailable
  if (props.viewType === ViewTypes.MONTH) {
    const endOfMonth = moment(props.endDate).endOf('month');
    if (moment(nextStartDate).isBefore(endOfMonth)) {
      isNextWindowAvailable = true;
    }
    if (props.scheduledEndDate) {
      const scheduledEndOfMonth = moment(props.scheduledEndDate).endOf('month');
      if (moment(nextStartDate).isBefore(scheduledEndOfMonth)) {
        isNextWindowAvailable = true;
      }
    }
  }
  // [End] Process previous and next window availability

  const moveToNextWindow = () => {
    if (isNextWindowAvailable) {
      props.selectView(props.page + 1, props.viewType, nextStartDate);
    }
    if (
      (isStrategyPreviewState ||
        isCustomScheduleState ||
        isCustomSchedulePreview) &&
      isNextWindowAvailable &&
      props.selectScheduledView
    ) {
      props.selectScheduledView(props.page + 1, props.viewType, nextStartDate);
    }
    setRequireMoveToToday(false);
  };

  const moveToDate = (targetDate: string) => {
    const startDate = moment(props.startDate);
    const endDate = moment(props.startDate).add(11, 'days');
    const dateToMove = moment(targetDate);
    let pageToMove = 0;
    if (dateToMove.isBetween(startDate, endDate, 'days', '[]')) {
      // already in correct page
    } else if (dateToMove.isAfter(endDate)) {
      pageToMove = Math.ceil(dateToMove.diff(endDate, 'days') / 12);
      const prevTargetDate = startDate
        .clone()
        .add((12 * pageToMove) as any, 'days')
        .format('YYYY-MM-DD');
      props.selectView(props.page + pageToMove, props.viewType, prevTargetDate);
    } else if (dateToMove.isBefore(startDate)) {
      pageToMove = Math.ceil(startDate.diff(dateToMove, 'days') / 12);
      const nextTargetDate = startDate
        .clone()
        .subtract((12 * pageToMove) as any, 'days')
        .format('YYYY-MM-DD');
      props.selectView(props.page - pageToMove, props.viewType, nextTargetDate);
    }
  };

  const moveToPreviousWindow = () => {
    // page number starts from zero for array processing
    if (isPrevWindowAvailable) {
      props.selectView(props.page - 1, props.viewType, prevStartDate);
    }
    if (
      (isStrategyPreviewState ||
        isCustomScheduleState ||
        isCustomSchedulePreview) &&
      isPrevWindowAvailable &&
      props.selectScheduledView
    ) {
      props.selectScheduledView(props.page - 1, props.viewType, prevStartDate);
    }
    setRequireMoveToToday(false);
  };

  const onClickUpdateViewType = (mode) => {
    if (props.isDateFilterNotApplied && props.reduxFilterState) {
      props.selectView(0, mode, props.reduxFilterState.startDate);
    } else {
      props.selectView(0, mode, '');
    }
    if (props.updateScheduledViewType) {
      props.updateScheduledViewType(mode, 0);
    }
    if (props.viewType !== ViewTypes.DAY) {
      setRequireMoveToToday(true);
      if (
        moment(todayDateString).isBetween(
          moment(props.startDate),
          moment(props.startDate).add(11, 'days'),
          'days',
          '[]'
        )
      ) {
        if (!props.isDateFilterNotApplied && props.isMoveToTargetDateEnabled) {
          setSelectedDate(todayDateString);
        }
      }
    } else {
      setRequireMoveToToday(false);
      setSelectedDate(props.startDate);
    }
  };

  const disableIfTodayNoTInRangeWhenFilterApplied =
    props.reduxFilterState &&
    props.reduxFilterState.startDate &&
    props.reduxFilterState.endDate &&
    !moment(todayDateString).isBetween(
      moment(props.reduxFilterState.startDate),
      moment(props.reduxFilterState.endDate),
      'days',
      '[]'
    );

  // Move the window to include current date
  if (
    !moment(todayDateString).isBetween(
      moment(props.startDate),
      moment(props.startDate).add(11, 'days'),
      'days',
      '[]'
    )
  ) {
    if (
      requireMoveToToday &&
      !props.isDateFilterNotApplied &&
      props.isMoveToTargetDateEnabled &&
      props.viewType === 'day'
    ) {
      moveToDate(todayDateString);
    }
  }

  const disableCalendarIcon =
    props.viewType !== 'day' || !props.isMoveToTargetDateEnabled;

  const customInput = ({
    onClick,
  }: {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }) => (
    <Button
      className={`${ROOT}__btn--calendar`}
      data-testid={`${ROOT}__btn--calendar`}
      onClick={onClick}
      disabled={disableCalendarIcon}
    >
      <CalendarIcon onClick={onClick} className={`${ROOT}__calendar-icon`} />
    </Button>
  );

  const $el = document.querySelector('body');

  const PopperContainer = ({ children }) =>
    ReactDOM.createPortal(children, $el);

  useEffect(() => {
    if (
      props.reduxFilterState &&
      props.viewType === ViewTypes.DAY &&
      !props.reduxFilterState.isDateFilterNotApplied
    ) {
      setSelectedDate(props.reduxFilterState.startDate);
    }
  }, [props.reduxFilterState]);

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__select-view-mode`}>
        <Button
          data-testid={`${ROOT}__btn--day`}
          className={isViewSelected('day')}
          onClick={() => onClickUpdateViewType('day')}
        >
          {msg().Psa_Lbl_Day}
        </Button>
        {/*
        // @ts-ignore */}
        <Button
          data-testid={`${ROOT}__btn--week`}
          className={isViewSelected('week')}
          onClick={() => onClickUpdateViewType('week')}
          disabled={props.isWeekViewDisabled}
        >
          {msg().Cal_Lbl_Week}
        </Button>
        {/*
        // @ts-ignore */}
        <Button
          data-testid={`${ROOT}__btn--month`}
          className={isViewSelected('month')}
          onClick={() => onClickUpdateViewType('month')}
          disabled={props.isMonthViewDisabled}
        >
          {msg().Com_Lbl_Month}
        </Button>
      </div>
      <div className={`${ROOT}__extra-btn`}>
        <Button
          className={`${ROOT}__today-btn`}
          disabled={
            props.viewType !== 'day' ||
            !props.isMoveToTargetDateEnabled ||
            disableIfTodayNoTInRangeWhenFilterApplied
          }
          data-testid={`${ROOT}__btn--today`}
          onClick={() => {
            setSelectedDate(todayDateString);
            moveToDate(todayDateString);
          }}
        >
          {msg().Psa_Btn_Today}
        </Button>
      </div>
      <div className={`${ROOT}__view-window`}>
        <Button
          data-testid={`${ROOT}__btn--prev`}
          onClick={moveToPreviousWindow}
          disabled={!isPrevWindowAvailable}
        >
          <ArrowLeft />
        </Button>
        <DateField
          popperClassName={`${ROOT}__popper`}
          popperContainer={PopperContainer}
          value={selectedDate}
          minDate={
            (props.reduxFilterState && props.reduxFilterState.startDate) ||
            moment(startOfMonth)
          }
          maxDate={
            (props.reduxFilterState &&
              moment(props.reduxFilterState.endDate)) ||
            endOfNextYearNextMonth
          }
          onChange={(updatedDate) => {
            if (updatedDate !== selectedDate) {
              setRequireMoveToToday(false);
              setSelectedDate(updatedDate);
              moveToDate(updatedDate);
            }
          }}
          disabled={disableCalendarIcon}
          customInput={React.createElement(customInput)}
        />
        <Button
          data-testid={`${ROOT}__btn--next`}
          onClick={moveToNextWindow}
          disabled={!isNextWindowAvailable}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default ResourcePlannerViewSelector;
