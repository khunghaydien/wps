/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from 'react';

import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import FinanceToggleView from '@apps/commons/components/psa/ToggleView';
import EmptyScreenContainer from '@apps/commons/containers/psa/EmptyScreenContainer';
import DownloadIcon from '@apps/commons/images/icons/download.svg';
import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import { downloadFinanceOverviewAsCSV } from '@apps/commons/utils/psa/ProjectFinanceUtil';

import { JOB_TYPE } from '@apps/domain/models/psa/BatchJobProject';

import ProjectInformationHeaderContainer from '@apps/psa-pc/containers/ProjectInformationHeaderContainer';

import StyledBasicCell from '@psa/components/FinanceGrid/BasicCell';
import GridColumn from '@psa/components/FinanceGrid/GridColumn';
import TitleColumn from '@psa/components/FinanceGrid/TitleColumn';

import useNote from '@apps/psa-pc/hooks/useNote';

import './index.scss';

export type Props = {
  currencyDecimal: number;
  currencySymbol: string;
  onFetchWorkingDays: (intervalType: string) => void;
  onSelectWeeklyMonthlyView: (intervalType: string) => void;
  financeOverviewData: any;
  selectedProject: any;
  fetchFinanceDetailContractFixed: (id: string) => void;
  fetchFinanceDetailContractTnM: (id: string) => void;
  fetchFinanceDetailOtherCategory: (id: string) => void;
  fetchFinanceDetailOtherExpense: (id: string) => void;
  workingDays: any;
  getFinanceMemo: (noteId: string) => void;
  saveFinanceMemo: (
    projectId: string,
    intervalType: string,
    noteId: string,
    note: string,
    summaryInfo?: object,
    detailInfo?: object
  ) => void;
  memo: string;
  isFetching: boolean;
  execBatchJobProject: (jobType: string) => void;
};

export const ROOT = 'ts-psa__finance';

const Finance = (props: Props) => {
  const [selectedView, setSelectedView] = useState('Monthly');
  const [activeCellId, setActiveCellId] = useState('');
  const [summaryInfo, setSummaryInfo] = useState({});
  const [detailInfo, setDetailInfo] = useState({});
  const [memo, updateMemo] = useNote();
  // for auto fill columns
  const [addedCols, setAddedCols] = useState([]);
  const [width, setWidth] = useState(0);

  // ref for textarea memo input
  const inputRef = useRef(null);

  const { currencyDecimal, financeOverviewData, selectedProject, workingDays } =
    props;
  const { workdays, total } = workingDays;
  const { revenue = {}, cost = {}, margin = {} } = financeOverviewData;

  // last Executed Time for batch job
  const [lastExecutedTime, setLastExecutedTime] = useState(
    financeOverviewData.lastExecutionTime
      ? financeOverviewData.lastExecutionTime
      : '-'
  );

  useEffect(() => {
    props.onSelectWeeklyMonthlyView(selectedView);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (memo.memoVisibility === 'visible') {
      inputRef.current.focus();
    } else {
      updateMemo.updateValue('');
    }
  }, [memo.memoVisibility]);

  useEffect(() => {
    if (document.querySelector('.ts-psa__finance__main-grid')) {
      const mainGridElement = document.querySelector(
        '.ts-psa__finance__main-grid'
      );
      const mainGridElementLength = (mainGridElement as any).offsetWidth;
      if (margin.intervalTotals.length > 0) {
        const elementWidth =
          mainGridElementLength - margin.intervalTotals.length * 112;
        const noOfCols = Math.ceil(elementWidth / 112);
        if (noOfCols >= 0) {
          setAddedCols(Array(noOfCols).fill('-'));
        } else {
          setAddedCols([]);
        }
      }
    }
  }, [width, margin.intervalTotals]);

  useEffect(() => {
    updateMemo.updateValue(props.memo);
  }, [props.memo]);

  // constants
  const revenueAmt = (label, amount) => {
    return (
      <div className={`${ROOT}__revenue-amt`}>
        <div className={`${ROOT}__revenue-amt-label`}>{label}</div>
        <div className={`${ROOT}__revenue-amt-amount`} title={amount}>
          {amount}
        </div>
      </div>
    );
  };

  useEffect(() => {
    setLastExecutedTime(financeOverviewData.lastExecutionTime);
  }, [financeOverviewData.lastExecutionTime]);

  const renderRevenueTypeOverview = () => {
    return (
      <div className={`${ROOT}__revenue-overview`}>
        <div className={`${ROOT}__revenue-overview__column`}>
          <div className={`${ROOT}__revenue-overview__column-item`}>
            {revenueAmt(
              msg().Psa_Lbl_ActualRevenue,
              revenue.eac
                ? FormatUtil.formatNumber(
                    revenue.eac.actualTotal,
                    currencyDecimal
                  )
                : 0
            )}
          </div>
          <div className={`${ROOT}__revenue-overview__column-item`}>
            {revenueAmt(
              msg().Psa_Lbl_TargetRevenue,
              revenue.eac
                ? FormatUtil.formatNumber(
                    revenue.eac.plannedTotal,
                    currencyDecimal
                  )
                : 0
            )}
          </div>
          <div className={`${ROOT}__revenue-overview__column-item`}>
            {revenueAmt(
              msg().Psa_Lbl_TargetAchievement,
              revenue.eac && revenue.eac.plannedTotal > 0
                ? `${Math.round(
                    (revenue.eac.actualTotal / revenue.eac.plannedTotal) * 100
                  )}%`
                : '0%'
            )}
          </div>
        </div>
        <div className={`${ROOT}__revenue-overview__column`}>
          <div className={`${ROOT}__revenue-overview__column-item`}>
            {revenueAmt(
              msg().Psa_Lbl_ActualMargin,
              `${
                margin.eac
                  ? FormatUtil.formatNumber(margin.eac.actualTotal, 2)
                  : 0
              }%`
            )}
          </div>
          <div className={`${ROOT}__revenue-overview__column-item`}>
            {revenueAmt(
              msg().Psa_Lbl_TargetMargin,
              `${
                margin.eac && margin.eac.targetMargin
                  ? FormatUtil.formatNumber(margin.eac.targetMargin, 2)
                  : 0
              }%`
            )}
          </div>
        </div>
      </div>
    );
  };
  // @ts-ignore
  const today = moment();
  const isJapanLocale = window.empInfo.language === 'ja';
  const monthlyDateFormat = isJapanLocale ? 'YYYY/MM' : 'MMM YYYY';
  let dateInterval = [];
  if (revenue.intervalTotals && revenue.intervalTotals.length > 0) {
    dateInterval = revenue.intervalTotals;
  } else if (cost.intervalTotals && cost.intervalTotals.length > 0) {
    dateInterval = cost.intervalTotals;
  } else if (margin.intervalTotals && margin.intervalTotals.length > 0) {
    dateInterval = margin.intervalTotals;
  }

  // event handlers
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  const onLabelClick = (id: string, recordType: string) => {
    // redirect to detail page according to id and recordType
    if (recordType === 'Sales') {
      if (selectedProject.contractType === 'Fixed') {
        props.fetchFinanceDetailContractFixed(id);
      } else if (selectedProject.contractType === 'TnM') {
        props.fetchFinanceDetailContractTnM(id);
      } else {
        props.fetchFinanceDetailOtherCategory(id);
      }
    } else if (recordType === 'ResourceCost') {
      props.fetchFinanceDetailContractTnM(id);
    } else if (recordType === 'Expense') {
      props.fetchFinanceDetailOtherExpense(id);
    } else {
      props.fetchFinanceDetailOtherCategory(id);
    }
  };

  const onPositionUpdate = (
    posX,
    posY,
    offsetLeft,
    offsetTop,
    width,
    height,
    noteId,
    summaryInfo,
    detailInfo
  ) => {
    if (!props.isFetching) {
      const mainGridElement = document.querySelector(`.${ROOT}__main-grid`);
      const scrollAmount = mainGridElement.scrollLeft;
      const mainPage = document.querySelector(`.${ROOT}`);
      const verticalScroll = mainPage.scrollTop;
      const calX = posX - scrollAmount;
      let calY = posY - verticalScroll;
      const calInnerSpinnerY = posY - verticalScroll;
      // corner case for bottom row
      if (window.innerHeight - posY < 100) {
        calY = posY - height - verticalScroll;
      }
      // visible and click outside of the text area
      // then hide the textarea first
      if (memo.memoVisibility === 'visible') {
        updateMemo.updateVisibility('hidden');
        updateMemo.updateValue('');
        props.saveFinanceMemo(
          props.selectedProject.projectId,
          selectedView,
          null,
          ''
        );
      } else {
        if (noteId) {
          props.getFinanceMemo(noteId);
        }
        updateMemo.updatePosition(calX, calY, calInnerSpinnerY);
        updateMemo.updateVisibility('visible');
        updateMemo.updateId(noteId);
        setSummaryInfo(summaryInfo);
        setDetailInfo(detailInfo);
      }
    }
  };

  const handleOnBlur = async () => {
    if (memo.memoValue !== '') {
      props.saveFinanceMemo(
        props.selectedProject.projectId,
        selectedView,
        memo.memoId,
        memo.memoValue,
        summaryInfo,
        detailInfo
      );
    }
    updateMemo.updateVisibility('hidden');
    setActiveCellId('');
  };

  const executeBatchJob = () => {
    props.execBatchJobProject(JOB_TYPE.ProjectFinance);
    setLastExecutedTime(msg().Admin_Lbl_PsaBatchJobCalculating);
  };

  // dynamic style constant
  const memoStyle = {
    position: 'absolute',
    maxWidth: '200px',
    minHeight: '100px',
    zIndex: '999',
    left: memo.memoPosition.x,
    top: memo.memoPosition.y,
    visibility: memo.memoVisibility,
  };
  const spinnerStyle = {
    position: 'absolute',
    zIndex: '9999',
    left: memo.spinnerPosition.x,
    top: memo.spinnerPosition.y,
  };

  return (
    <div
      className={`${ROOT} ${
        memo.memoVisibility === 'visible' ? 'scrollDisable' : ''
      }`}
    >
      <textarea
        ref={inputRef}
        // @ts-ignore
        style={memoStyle}
        className={`${ROOT}__memo`}
        value={memo.memoValue}
        onChange={(e) => updateMemo.updateValue(e.target.value)}
        readOnly={props.isFetching}
        onBlur={handleOnBlur}
      ></textarea>
      {props.isFetching && (
        <div
          className="demo-only"
          // @ts-ignore
          style={spinnerStyle}
        >
          <div className="slds-spinner_container">
            <div role="status" className="slds-spinner slds-spinner_small">
              <div className="slds-spinner__dot-a"></div>
              <div className="slds-spinner__dot-b"></div>
            </div>
          </div>
        </div>
      )}
      <PSACommonHeader title={msg().Psa_Lbl_ProjectFinance}>
        <Button
          className={`${ROOT}__execute-btn`}
          type="secondary"
          disabled={lastExecutedTime === msg().Admin_Lbl_PsaBatchJobCalculating}
          onClick={executeBatchJob}
        >
          {msg().Admin_Lbl_PsaBatchJobCalculate} <br />{' '}
          <span className={`${ROOT}__execute-time`}>
            {msg().Admin_Lbl_PsaBatchJobLastTime}: {lastExecutedTime}
          </span>
        </Button>
        <Button
          className={`${ROOT}__download-btn`}
          data-testid={`${ROOT}__download-btn`}
          onClick={() => {
            downloadFinanceOverviewAsCSV(
              workingDays,
              financeOverviewData,
              selectedView
            );
          }}
        >
          <DownloadIcon className={`${ROOT}__download-icon`} />
        </Button>
        <FinanceToggleView
          setSelectedView={setSelectedView}
          planningCycle={selectedProject.planningCycle}
          onSelectWeeklyMonthlyView={props.onSelectWeeklyMonthlyView}
        />
      </PSACommonHeader>
      <ProjectInformationHeaderContainer />
      {renderRevenueTypeOverview()}
      {dateInterval.length > 0 ? (
        <div className={`${ROOT}__finance-overview`}>
          <div className={`${ROOT}__left`}>
            <TitleColumn
              id={'columnTitle'}
              title={msg().Psa_Lbl_FinanceOverview}
              items={[
                {
                  id: 'activeView',
                  name:
                    selectedView === 'Monthly'
                      ? msg().Com_Lbl_Month
                      : msg().Cal_Lbl_Week,
                  mergedRows: 2,
                },
                {
                  id: 'workDays',
                  name: msg().Psa_Lbl_FinanceWorkDays,
                  divider: true,
                },
              ]}
              mergedRows={3}
              divider
            >
              <div className={`${ROOT}__left-title`}>
                <div>{msg().Psa_Lbl_LegendDetails}</div>
              </div>
            </TitleColumn>
            <div className={`${ROOT}__left-content`}>
              <TitleColumn
                id={'revenueTitle'}
                title={msg().Psa_Lbl_FinanceRevenue}
                background="#fff5d9"
                items={[
                  {
                    id: 'revenue-plan',
                    name: msg().Psa_Lbl_FinancePlan,
                    background: '#f3e1ad',
                  },
                  { id: 'revenue-actual', name: msg().Psa_Lbl_FinanceActual },
                ]}
                mergedRows={2}
              />
              {revenue &&
                revenue.finances &&
                revenue.finances.map((item, i) => {
                  const hasDivider = i === revenue.finances.length - 1;
                  return (
                    <TitleColumn
                      id={item.financeCategoryId}
                      title={item.name}
                      fontWeight="normal"
                      items={[
                        {
                          id: item.financeCategoryId + '-plan',
                          name: msg().Psa_Lbl_FinancePlan,
                          background: '#eee',
                        },
                        {
                          id: item.financeCategory + '-actual',
                          name: msg().Psa_Lbl_FinanceActual,
                          divider: hasDivider,
                        },
                      ]}
                      onClick={(id) => onLabelClick(id, item.recordType)}
                      mergedRows={2}
                      divider={hasDivider}
                    />
                  );
                })}
              <TitleColumn
                id={'costTitle'}
                title={msg().Psa_Lbl_FinanceCost}
                background="#fff5d9"
                items={[
                  {
                    id: 'cost-plan',
                    name: msg().Psa_Lbl_FinancePlan,
                    background: '#f3e1ad',
                  },
                  { id: 'cost-actual', name: msg().Psa_Lbl_FinanceActual },
                ]}
                mergedRows={2}
              />
              {cost &&
                cost.finances &&
                cost.finances.map((item, i) => {
                  const hasDivider = i === cost.finances.length - 1;
                  return (
                    <TitleColumn
                      id={item.financeCategoryId}
                      title={item.name}
                      fontWeight="normal"
                      items={[
                        {
                          id: item.financeCategoryId + '-plan',
                          name: msg().Psa_Lbl_FinancePlan,
                          background: '#eee',
                        },
                        {
                          id: item.financeCategoryId + '-actual',
                          name: msg().Psa_Lbl_FinanceActual,
                          divider: hasDivider,
                        },
                      ]}
                      onClick={(id) => onLabelClick(id, item.recordType)}
                      mergedRows={2}
                      divider={hasDivider}
                    />
                  );
                })}
            </div>
            <TitleColumn
              id={'marginTitle'}
              title={msg().Psa_Lbl_FinanceMargin}
              background="#EAF3FE"
              items={[
                {
                  id: 'margin-plan',
                  name: msg().Psa_Lbl_FinancePlan,
                  background: '#D6E4F5',
                },
                {
                  id: 'margin-actual',
                  name: msg().Psa_Lbl_FinanceActual,
                  background: '#EAF3FE',
                },
              ]}
              mergedRows={2}
            />
          </div>
          <div
            className={`${ROOT}__main-grid ${
              memo.memoVisibility === 'visible' ? 'scrollDisable' : ''
            }`}
          >
            <div className={`${ROOT}__main-grid-header-container`}>
              {dateInterval.concat(addedCols).map((total, index) => {
                const startDate = moment(total.startDate, 'DD/MM/YYYY');
                const endDate = moment(total.endDate, 'DD/MM/YYYY');

                let colClass = '';
                if (today.isAfter(startDate) && today.isBefore(endDate)) {
                  colClass = '#c3defd';
                } else if (today.isBefore(startDate)) {
                  colClass = '#ebf3f7';
                } else if (today.isAfter(endDate)) {
                  colClass = '#eee';
                }

                let formattedStartDate = startDate.format(monthlyDateFormat);

                if (selectedView === 'Weekly') {
                  let startDay = `${startDate.format('D')}`;
                  if (endDate.format('MM') !== startDate.format('MM')) {
                    startDay = `${startDate.format('D MMM')}`;
                  }
                  const endDay = `${endDate.format('D MMM')}`;
                  formattedStartDate = `${startDay} - ${endDay}`;
                }

                if (total === '-' && dateInterval.length > 0) {
                  const intialLength = dateInterval.length;
                  formattedStartDate = moment(
                    dateInterval[intialLength - 1].startDate,
                    'DD/MM/YYYY'
                  )
                    .add(index - intialLength + 1, 'month')
                    .format(monthlyDateFormat);
                }
                return (
                  <div className={`${ROOT}__main-grid-header-cells`}>
                    <StyledBasicCell
                      id="main-grid-header-date"
                      width="100%"
                      height="50px"
                      background={colClass}
                      textAlign="center"
                    >
                      {formattedStartDate}
                    </StyledBasicCell>
                    <StyledBasicCell
                      id="main-grid-header-work-days"
                      height="25px"
                      width="100%"
                      textAlign="center"
                      background="#fff"
                      divider
                    >
                      {(workdays &&
                        workdays.length === dateInterval.length &&
                        workdays[index] &&
                        workdays[index].workdays) ||
                        0}
                    </StyledBasicCell>
                  </div>
                );
              })}
            </div>
            <div className={`${ROOT}__main-grid-content`}>
              <div className={`${ROOT}__main-grid-content-row`}>
                {revenue.intervalTotals &&
                  revenue.intervalTotals.concat(addedCols).map((interval) => {
                    const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                    // const colClass = today.isAfter(endDate) ? 'past-title' : '';
                    const colClass = today.isAfter(endDate) ? '#f6dfc4' : '';
                    const shadedColor = today.isAfter(endDate)
                      ? '#edc89d'
                      : '#f3e1ad';

                    let formattedIntervalPlanned = FormatUtil.formatNumber(
                      interval.planned,
                      currencyDecimal
                    );
                    let formattedIntervalActual = FormatUtil.formatNumber(
                      interval.actual,
                      currencyDecimal
                    );

                    if (interval === '-') {
                      formattedIntervalPlanned = '';
                      formattedIntervalActual = '';
                    }
                    return (
                      <GridColumn
                        setActiveCellId={setActiveCellId}
                        activeCellId={activeCellId}
                        items={[
                          {
                            id: interval.projectPeriodId + '_RevenuePlan',
                            value: formattedIntervalPlanned,
                            background: shadedColor,
                            noteId: interval.plannedNoteId,
                            summaryInfo: {
                              projectPeriodId: interval.projectPeriodId,
                              projectId: props.selectedProject.projectId,
                              fieldType: 'RevenuePlan',
                              isFinances: false,
                              detailType: 'revenue',
                            },
                          },
                          {
                            id: interval.projectPeriodId + '_RevenueActual',
                            value: formattedIntervalActual,
                            background: colClass,
                            noteId: interval.actualNoteId,
                            summaryInfo: {
                              projectPeriodId: interval.projectPeriodId,
                              projectId: props.selectedProject.projectId,
                              fieldType: 'RevenueActual',
                              isFinances: false,
                              detailType: 'revenue',
                            },
                          },
                        ]}
                        updatePosition={onPositionUpdate}
                      />
                    );
                  })}
              </div>
              {revenue.finances &&
                revenue.finances.map((financeCategoryItem, i) => {
                  const content =
                    financeCategoryItem.intervals &&
                    financeCategoryItem.intervals
                      .concat(addedCols)
                      .map((interval) => {
                        const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                        const colClass = today.isAfter(endDate)
                          ? '#eeeeee'
                          : '#ffffff';
                        const shadedColor = today.isAfter(endDate)
                          ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #EEEEEE'
                          : 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #FFFFFF';
                        let formattedIntervalPlanned = FormatUtil.formatNumber(
                          interval.planned,
                          currencyDecimal
                        );
                        let formattedIntervalActual = FormatUtil.formatNumber(
                          interval.actual,
                          currencyDecimal
                        );

                        if (interval === '-') {
                          formattedIntervalPlanned = '';
                          formattedIntervalActual = '';
                        }

                        return (
                          <GridColumn
                            setActiveCellId={setActiveCellId}
                            activeCellId={activeCellId}
                            items={[
                              {
                                id: interval.summaryId + '_Planned',
                                value: formattedIntervalPlanned,
                                background: shadedColor,
                                noteId: interval.plannedNoteId,
                                summaryInfo: {
                                  summaryId: interval.summaryId,
                                  projectId: props.selectedProject.projectId,
                                  fieldType: 'Planned',
                                  isFinances: true,
                                  financeCode: financeCategoryItem.code,
                                  detailType: 'revenue',
                                },
                              },
                              {
                                id: interval.summaryId + 'Actual',
                                value: formattedIntervalActual,
                                background: colClass,
                                divider: i === revenue.finances.length - 1,
                                noteId: interval.actualNoteId,
                                summaryInfo: {
                                  summaryId: interval.summaryId,
                                  projectId: props.selectedProject.projectId,
                                  fieldType: 'Actual',
                                  isFinances: true,
                                  financeCode: financeCategoryItem.code,
                                  detailType: 'revenue',
                                },
                              },
                            ]}
                            updatePosition={onPositionUpdate}
                          />
                        );
                      });
                  return (
                    <div className={`${ROOT}__main-grid-content-row`}>
                      {content}
                    </div>
                  );
                })}

              <div className={`${ROOT}__main-grid-content-row`}>
                {cost.intervalTotals &&
                  cost.intervalTotals.concat(addedCols).map((interval) => {
                    const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                    const colClass = today.isAfter(endDate) ? '#f6dfc4' : '';
                    const shadedColor = today.isAfter(endDate)
                      ? '#edc89d'
                      : '#f3e1ad';
                    let formattedIntervalPlanned = FormatUtil.formatNumber(
                      interval.planned,
                      currencyDecimal
                    );
                    let formattedIntervalActual = FormatUtil.formatNumber(
                      interval.actual,
                      currencyDecimal
                    );

                    if (interval === '-') {
                      formattedIntervalPlanned = '';
                      formattedIntervalActual = '';
                    }
                    return (
                      <GridColumn
                        setActiveCellId={setActiveCellId}
                        activeCellId={activeCellId}
                        items={[
                          {
                            id: interval.projectPeriodId + '_CostPlan',
                            value: formattedIntervalPlanned,
                            background: shadedColor,
                            noteId: interval.plannedNoteId,
                            summaryInfo: {
                              projectPeriodId: interval.projectPeriodId,
                              projectId: props.selectedProject.projectId,
                              fieldType: 'CostPlan',
                              isFinances: false,
                              detailType: 'cost',
                            },
                          },
                          {
                            id: interval.projectPeriodId + '_CostActual',
                            value: formattedIntervalActual,
                            background: colClass,
                            noteId: interval.actualNoteId,
                            summaryInfo: {
                              projectPeriodId: interval.projectPeriodId,
                              projectId: props.selectedProject.projectId,
                              fieldType: 'CostActual',
                              isFinances: false,
                              detailType: 'cost',
                            },
                          },
                        ]}
                        updatePosition={onPositionUpdate}
                      />
                    );
                  })}
              </div>
              {cost.finances &&
                cost.finances.map((financeCategoryItem, i) => {
                  const content =
                    financeCategoryItem.intervals &&
                    financeCategoryItem.intervals
                      .concat(addedCols)
                      .map((interval) => {
                        const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                        const colClass = today.isAfter(endDate)
                          ? '#eeeeee'
                          : '#ffffff';
                        const shadedColor = today.isAfter(endDate)
                          ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #EEEEEE'
                          : 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #FFFFFF';
                        let formattedIntervalPlanned = FormatUtil.formatNumber(
                          interval.planned,
                          currencyDecimal
                        );
                        let formattedIntervalActual = FormatUtil.formatNumber(
                          interval.actual,
                          currencyDecimal
                        );

                        if (interval === '-') {
                          formattedIntervalPlanned = '';
                          formattedIntervalActual = '';
                        }

                        return (
                          <GridColumn
                            setActiveCellId={setActiveCellId}
                            activeCellId={activeCellId}
                            items={[
                              {
                                id: interval.summaryId + '_Planned',
                                value: formattedIntervalPlanned,
                                background: shadedColor,
                                noteId: interval.plannedNoteId,
                                summaryInfo: {
                                  summaryId: interval.summaryId,
                                  projectId: props.selectedProject.projectId,
                                  fieldType: 'Planned',
                                  isFinances: true,
                                  financeCode: financeCategoryItem.code,
                                  detailType: 'cost',
                                },
                              },
                              {
                                id: interval.summaryId + 'Actual',
                                value: formattedIntervalActual,
                                background: colClass,
                                divider: i === cost.finances.length - 1,
                                noteId: interval.actualNoteId,
                                summaryInfo: {
                                  summaryId: interval.summaryId,
                                  projectId: props.selectedProject.projectId,
                                  fieldType: 'Actual',
                                  isFinances: true,
                                  financeCode: financeCategoryItem.code,
                                  detailType: 'cost',
                                },
                              },
                            ]}
                            updatePosition={onPositionUpdate}
                          />
                        );
                      });
                  return (
                    <div className={`${ROOT}__main-grid-content-row`}>
                      {content}
                    </div>
                  );
                })}

              <div className={`${ROOT}__main-grid-content-row`}>
                {margin.intervalTotals &&
                  margin.intervalTotals.concat(addedCols).map((interval) => {
                    const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                    const colClass = today.isAfter(endDate)
                      ? '#BDD0F8'
                      : '#EAF3FE';
                    const shadedColor = today.isAfter(endDate)
                      ? '#A0BAF1'
                      : '#D6E4F5';

                    let intervalPlanned = `${FormatUtil.formatNumber(
                      interval.planned,
                      2
                    )}%`;
                    let intervalActual = `${FormatUtil.formatNumber(
                      interval.actual,
                      2
                    )}%`;

                    if (interval === '-') {
                      intervalPlanned = '';
                      intervalActual = '';
                    }

                    return (
                      <GridColumn
                        setActiveCellId={setActiveCellId}
                        activeCellId={activeCellId}
                        items={[
                          {
                            id: interval.projectPeriodId + '_MarginPlan',
                            value: intervalPlanned,
                            background: shadedColor,
                            noteId: interval.plannedNoteId,
                            summaryInfo: {
                              projectPeriodId: interval.projectPeriodId,
                              projectId: props.selectedProject.projectId,
                              fieldType: 'MarginPlan',
                              isFinances: false,
                              detailType: 'margin',
                            },
                          },
                          {
                            id: interval.projectPeriodId + '_MarginActual',
                            value: intervalActual,
                            background: colClass,
                            noteId: interval.actualNoteId,
                            summaryInfo: {
                              projectPeriodId: interval.projectPeriodId,
                              projectId: props.selectedProject.projectId,
                              fieldType: 'MarginActual',
                              isFinances: false,
                              detailType: 'margin',
                            },
                          },
                        ]}
                        updatePosition={onPositionUpdate}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
          <div className={`${ROOT}__right`}>
            <StyledBasicCell
              id="eacTitle"
              title={msg().Psa_Lbl_FinanceEAC}
              width="100%"
              height="50px"
              textAlign="center"
            >
              {msg().Psa_Lbl_FinanceEAC}
            </StyledBasicCell>
            <StyledBasicCell
              id="eacTotal"
              width="100%"
              height="25px"
              textAlign="center"
              divider
            >
              {total || 0}
            </StyledBasicCell>
            <div className={`${ROOT}__right-content`}>
              {revenue.eac && (
                <GridColumn
                  items={[
                    {
                      id: 'eac-revenue-total-plan',
                      value: FormatUtil.formatNumber(
                        revenue.eac.plannedTotal,
                        currencyDecimal
                      ),
                      background: '#F3E1AD',
                    },
                    {
                      id: 'eac-revenue-total-actual',
                      value: FormatUtil.formatNumber(
                        revenue.eac.actualTotal,
                        currencyDecimal
                      ),
                      background: '#FFF5D9',
                    },
                  ]}
                  width="100%"
                />
              )}

              {revenue.finances &&
                revenue.finances.map((financeCategoryItem, i) => {
                  return (
                    <GridColumn
                      items={[
                        {
                          id: 'eac-revenue-plan',
                          value: FormatUtil.formatNumber(
                            financeCategoryItem.eac.plannedTotal,
                            currencyDecimal
                          ),
                          background:
                            'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #FFFFFF',
                        },
                        {
                          id: 'eac-revenue-actual',
                          value: FormatUtil.formatNumber(
                            financeCategoryItem.eac.actualTotal,
                            currencyDecimal
                          ),
                          background: '#ffffff',
                          divider: i === revenue.finances.length - 1,
                        },
                      ]}
                      width="100%"
                    />
                  );
                })}

              {cost.eac && (
                <GridColumn
                  items={[
                    {
                      id: 'eac-cost-total-plan',
                      value: FormatUtil.formatNumber(
                        cost.eac.plannedTotal,
                        currencyDecimal
                      ),
                      background: '#F3E1AD',
                    },
                    {
                      id: 'eac-cost-total-actual',
                      value: FormatUtil.formatNumber(
                        cost.eac.actualTotal,
                        currencyDecimal
                      ),
                      background: '#FFF5D9',
                    },
                  ]}
                  width="100%"
                />
              )}
              {cost.finances &&
                cost.finances.map((financeCategoryItem, i) => {
                  return (
                    <GridColumn
                      items={[
                        {
                          id: 'eac-cost-plan',
                          value: FormatUtil.formatNumber(
                            financeCategoryItem.eac.plannedTotal,
                            currencyDecimal
                          ),
                          background:
                            'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #FFFFFF',
                        },
                        {
                          id: 'eac-cost-actual',
                          value: FormatUtil.formatNumber(
                            financeCategoryItem.eac.actualTotal,
                            currencyDecimal
                          ),
                          background: '#ffffff',
                          divider: i === cost.finances.length - 1,
                        },
                      ]}
                      width="100%"
                    />
                  );
                })}
            </div>
            <GridColumn
              items={[
                {
                  id: 'eac-margin-plan',
                  value: margin.eac
                    ? `${FormatUtil.formatNumber(margin.eac.plannedTotal, 2)}%`
                    : '-',
                  background: '#D6E4F5',
                },
                {
                  id: 'eac-margin-actual',
                  value: margin.eac
                    ? `${FormatUtil.formatNumber(margin.eac.actualTotal, 2)}%`
                    : '-',
                  background: '#EAF3FE',
                },
              ]}
              width="100%"
            />
          </div>
        </div>
      ) : (
        <EmptyScreenContainer
          headerMessage={msg().Psa_Lbl_EmptyFinanceDetailHeader}
        />
      )}
    </div>
  );
};

export default Finance;
