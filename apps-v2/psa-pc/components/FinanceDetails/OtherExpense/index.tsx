/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import FinanceToggleView from '@apps/commons/components/psa/ToggleView';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import BtnClose from '@apps/core/assets/icons/close.svg';

import { JOB_TYPE } from '@apps/domain/models/psa/BatchJobProject';

import ProjectInformationHeaderContainer from '@apps/psa-pc/containers/ProjectInformationHeaderContainer';

import StyledBasicCell from '@psa/components/FinanceGrid/BasicCell';
import GridColumn from '@psa/components/FinanceGrid/GridColumn';
import TitleColumn from '@psa/components/FinanceGrid/TitleColumn';

import useNote from '@apps/psa-pc/hooks/useNote';

import './index.scss';

export type Props = {
  breakDown: any;
  currencyDecimal: number;
  selectedProject: any;
  currencySymbol: string;
  otherExpenseData: any;
  workingDays: any;
  onSelectWeeklyMonthlyView: (arg0: string) => void;
  onSaveChanges: (param: any, intervalType: string) => void;
  onFetchExpenseRecords: (breakdownId: string) => void;
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

export const ROOT = 'ts-psa__finance-detail-other-expense';

const FinanceDetailOtherExpense = (props: Props) => {
  const {
    currencyDecimal,
    otherExpenseData,
    workingDays,
    selectedProject,
    breakDown,
  } = props;
  const { summary, financeDetails } = otherExpenseData;

  const [detailList, setDetailList] = useState(financeDetails);
  const [summaryList, setSummaryList] = useState(summary);
  const [editable, setEditable] = useState(false);
  const [activeCellId, setActiveCellId] = useState('');
  const [selectedView, setSelectedView] = useState('Monthly');
  const [width, setWidth] = useState(window.innerWidth);
  const [addedCols, setAddedCols] = useState([]);
  const [tableVisibility, setTableVisibility] = useState(false);
  const [memo, updateMemo] = useNote();
  const [summaryInfo, setSummaryInfo] = useState({});
  const [detailInfo, setDetailInfo] = useState({});
  const [lastExecutedTime, setLastExecutedTime] = useState(
    summary.lastExecutionTime ? summary.lastExecutionTime : '-'
  );
  const inputRef = useRef(null);

  // @ts-ignore
  const today = moment();
  const isJapanLocale = window.empInfo.language === 'ja';
  const monthlyDateFormat = isJapanLocale ? 'YYYY/MM' : 'MMM YYYY';
  const activeView =
    selectedView === 'Monthly'
      ? msg().Psa_Lbl_FinanceMonth
      : msg().Cal_Lbl_Week;

  useEffect(() => {
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
    if (
      document.querySelector(
        '.ts-psa__finance-detail-other-expense__main-grid'
      ) &&
      summary
    ) {
      const mainGridElement = document.querySelector(
        '.ts-psa__finance-detail-other-expense__main-grid'
      );
      const elementWidth =
        (mainGridElement as any).offsetWidth -
        summary.intervalTotals.length * 112;
      const noOfCols = Math.ceil(elementWidth / 112);
      if (noOfCols >= 0) {
        setAddedCols(Array(noOfCols).fill('-'));
      } else {
        setAddedCols([]);
      }
    }
  }, [width, summary]);

  useEffect(() => {
    updateMemo.updateValue(props.memo);
  }, [props.memo]);

  // event handlers
  const resetCellValue = () => {
    setDetailList(financeDetails);
    setSummaryList(summary);
    setEditable(false);
    setActiveCellId('');
  };

  useEffect(() => {
    setLastExecutedTime(summary.lastExecutionTime);
  }, [summary.lastExecutionTime]);

  const onChangeSummaryCellValue = (id: string, value: string) => {
    let itemIndex;
    const newSummaryList = cloneDeep(summaryList);
    const summaryId = id.slice(0, id.indexOf('_'));
    newSummaryList.intervalTotals.forEach((item, i) => {
      if (item.summaryId === summaryId) {
        itemIndex = i;
      }
    });
    if (!value || value === '') {
      value = '0';
    }
    newSummaryList.intervalTotals[itemIndex].plannedAmt = Number(
      value.replace(/,/g, '')
    );
    setSummaryList(newSummaryList);
  };

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  const formatPeriodDate = (data) => {
    const startDate = moment(data.startDate, 'DD/MM/YYYY');
    const endDate = moment(data.endDate, 'DD/MM/YYYY');
    let formattedStartDate = startDate.format(monthlyDateFormat);
    if (selectedView === 'Weekly') {
      let startDay = `${startDate.format('D')}`;
      if (endDate.format('MM') !== startDate.format('MM')) {
        startDay = `${startDate.format('D MMM')}`;
      }
      const endDay = `${endDate.format('D MMM')}`;
      formattedStartDate = `${startDay} - ${endDay}`;
    }
    return formattedStartDate;
  };

  const renderBlock = (label, value) => {
    return (
      <div className={`${ROOT}__table--overview-header-container`}>
        <div className={`${ROOT}__table--overview-header-label`}>{label}</div>
        <div className={`${ROOT}__table--overview-header-value`}>{value}</div>
      </div>
    );
  };

  const showTable = (breakDownId: string) => {
    props.onFetchExpenseRecords(breakDownId);
    setTableVisibility(true);
  };

  const closeTable = () => {
    setTableVisibility(false);
  };

  const renderTableHeader = () => {
    const formattedTotalAmount = FormatUtil.formatNumber(
      breakDown.totalAmount,
      currencyDecimal
    );
    return (
      <div className={`${ROOT}__table--overview-header`}>
        <div>
          {renderBlock(msg().Psa_Lbl_Period, formatPeriodDate(breakDown))}
        </div>
        <div>
          {renderBlock(msg().Psa_Lbl_ExpenseType, breakDown.expenseType)}
        </div>
        <div>
          {renderBlock(msg().Psa_Lbl_TotalAmount, formattedTotalAmount)}
        </div>
        <div className={`${ROOT}__btn-close-container`}>
          <BtnClose onClick={closeTable} className={`${ROOT}__btn-close`} />
        </div>
      </div>
    );
  };
  const renderTable = () => {
    const sizeList = [2, 4, 2, 2, 2];
    return (
      <div>
        <MultiColumnsGrid
          sizeList={sizeList}
          className={`${ROOT}__table-header-container`}
        >
          <div className={`${ROOT}__table-header-label`}>
            {msg().Psa_Lbl_ReportNo}
          </div>
          <div className={`${ROOT}__table-header-label`}>
            {msg().Psa_Lbl_ReportTitle}
          </div>
          <div className={`${ROOT}__table-header-label`}>
            {msg().Psa_Lbl_RecordDate}
          </div>
          <div className={`${ROOT}__table-header-label`}>
            {msg().Psa_Lbl_Employee}
          </div>
          <div
            className={`${ROOT}__table-header-label ${ROOT}__table-header-amount`}
          >
            {msg().Psa_Lbl_Amount}
          </div>
        </MultiColumnsGrid>
        {breakDown.expenseReportItems.map((reportItem) => {
          const dateArray = reportItem.recordDate.split('/');
          const correctDateFormat =
            dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
          const formattedReportItemAmount = FormatUtil.formatNumber(
            reportItem.amount,
            currencyDecimal
          );
          return (
            <MultiColumnsGrid
              sizeList={sizeList}
              className={`${ROOT}__table-content`}
            >
              <div className={`${ROOT}__table-header-label`}>
                {reportItem.reportItemNo}
              </div>
              <div className={`${ROOT}__table-header-label`}>
                {reportItem.title}
              </div>
              <div className={`${ROOT}__table-header-label`}>
                {DateUtil.format(correctDateFormat)}
              </div>
              <div className={`${ROOT}__table-header-label`}>
                {reportItem.employeeName}
              </div>
              <div
                className={`${ROOT}__table-header-label ${ROOT}__table-header-amount`}
              >
                {formattedReportItemAmount}
              </div>
            </MultiColumnsGrid>
          );
        })}
      </div>
    );
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

  const handleOnBlur = () => {
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
    props.execBatchJobProject(JOB_TYPE.Expense);
    setLastExecutedTime(msg().Admin_Lbl_PsaBatchJobCalculating);
  };

  const activateButton =
    lastExecutedTime === msg().Admin_Lbl_PsaBatchJobCalculating;

  const isExpenseRecordType = summary.recordType.value === 'Expense';

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
      />
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
      <PSACommonHeader title={summary.financeCategoryName}>
        {!editable && isExpenseRecordType && (
          <Button
            className={`${ROOT}__execute-btn`}
            type="secondary"
            disabled={activateButton}
            onClick={executeBatchJob}
          >
            {msg().Admin_Lbl_PsaBatchJobCalculate} <br />{' '}
            <span className={`${ROOT}__execute-time`}>
              {msg().Admin_Lbl_PsaBatchJobLastTime}: {lastExecutedTime}
            </span>
          </Button>
        )}
        {!editable && (
          <Button
            data-testid={`${ROOT}__btn--edit`}
            className={`${ROOT}__btn--edit`}
            onClick={() => {
              setEditable(true);
            }}
          >
            {msg().Psa_Btn_Edit}
          </Button>
        )}
        {editable && (
          <Button
            data-test-id={`${ROOT}__btn--cancel`}
            className={`${ROOT}__btn--cancel`}
            onClick={() => {
              resetCellValue();
            }}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
        )}
        {editable && (
          <Button
            data-test-id={`${ROOT}__btn--save`}
            className={`${ROOT}__btn--save`}
            type="primary"
            onClick={() => {
              props.onSaveChanges(
                {
                  projectId: summaryList.projectId,
                  financeCategoryId: summaryList.financeCategoryId,
                  summaries: [...summaryList.intervalTotals],
                },
                selectedView
              );
              setEditable(false);
              setActiveCellId('');
            }}
          >
            {msg().Com_Btn_Save}
          </Button>
        )}
        {!editable && (
          <FinanceToggleView
            planningCycle={selectedProject.planningCycle}
            onSelectWeeklyMonthlyView={props.onSelectWeeklyMonthlyView}
            setSelectedView={setSelectedView}
            selectedView={selectedView}
          />
        )}
      </PSACommonHeader>
      <ProjectInformationHeaderContainer />
      <div className={`${ROOT}__finance-overview`}>
        <div className={`${ROOT}__left`}>
          <TitleColumn
            id={'columnTitle'}
            title={msg().Psa_Lbl_LegendDetails}
            items={[
              {
                id: 'activeView',
                name: activeView,
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
          />
          <div className={`${ROOT}__left-content`}>
            <TitleColumn
              title={summary.financeCategoryName}
              background={'#fff5d9'}
              items={[
                {
                  name: msg().Psa_Lbl_FinancePlan,
                  className: 'left-title-shade',
                },
                { name: msg().Psa_Lbl_FinanceActual },
              ]}
              mergedRows={2}
            />
            {detailList.map((item) => {
              return (
                <TitleColumn
                  title={item.detailName || '-'}
                  fontWeight={'normal'}
                  items={[{ name: msg().Psa_Lbl_FinanceActual }]}
                  mergedRows={1}
                  padding={'0 0 0 16px'}
                >
                  <StyledBasicCell
                    id={item.detailId}
                    title={item.detailName}
                    width={'100%'}
                    textAlign="left"
                    padding="0 0 0 0"
                  >
                    {item.detailName}
                  </StyledBasicCell>
                </TitleColumn>
              );
            })}
          </div>
        </div>
        <div
          className={`${ROOT}__main-grid ${
            memo.memoVisibility === 'visible' ? 'scrollDisable' : ''
          }`}
        >
          <div className={`${ROOT}__main-grid-header-container`}>
            {summary.intervalTotals &&
              summary.intervalTotals.concat(addedCols).map((total, index) => {
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
                let formattedStartDate = formatPeriodDate(total);

                if (total === '-') {
                  const intialLength = summary.intervalTotals.length;
                  formattedStartDate = moment(
                    summary.intervalTotals[intialLength - 1].startDate,
                    'DD/MM/YYYY'
                  )
                    .add(index - intialLength + 1, 'month')
                    .format(monthlyDateFormat);
                }
                return (
                  <div className={`${ROOT}__main-grid-header-cells`}>
                    <StyledBasicCell
                      width="100%"
                      height="50px"
                      background={colClass}
                      textAlign="center"
                    >
                      {formattedStartDate}
                    </StyledBasicCell>
                    <StyledBasicCell
                      height="25px"
                      width="100%"
                      textAlign="center"
                      background="#fff"
                      divider
                    >
                      {(workingDays.workdays &&
                        workingDays.workdays[index] &&
                        workingDays.workdays[index].workdays) ||
                        0}
                    </StyledBasicCell>
                  </div>
                );
              })}
          </div>

          <div className={`${ROOT}__main-grid-content`}>
            <div className={`${ROOT}__main-grid-content-row`}>
              {summary.intervalTotals &&
                summary.intervalTotals.concat(addedCols).map((interval) => {
                  const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                  const colClass = today.isAfter(endDate) ? '#f6dfc4' : '';
                  const shadedColor = today.isAfter(endDate)
                    ? '#edc89d'
                    : '#f3e1ad';
                  let formattedPlannedValue = FormatUtil.formatNumber(
                    interval.plannedAmt,
                    currencyDecimal
                  );
                  let formattedActualValue = FormatUtil.formatNumber(
                    interval.actualAmt,
                    currencyDecimal
                  );
                  let isEditable = editable;
                  if (interval === '-') {
                    formattedPlannedValue = '';
                    formattedActualValue = '';
                    isEditable = false;
                  }
                  return (
                    <GridColumn
                      activeCellId={activeCellId}
                      setActiveCellId={setActiveCellId}
                      onChangeCellValue={onChangeSummaryCellValue}
                      updatePosition={onPositionUpdate}
                      items={[
                        {
                          id: interval.summaryId + '_Planned',
                          value: !editable
                            ? formattedPlannedValue
                            : interval.plannedAmt,
                          background: shadedColor,
                          editable: isEditable,
                          noteId: interval.plannedAmtNoteId,
                          summaryInfo: {
                            summaryId: interval.summaryId,
                            projectId: props.selectedProject.projectId,
                            fieldType: 'Planned',
                          },
                        },
                        {
                          id: interval.summaryId + '_Actual',
                          value: formattedActualValue,
                          background: colClass,
                          noteId: interval.actualAmtNoteId,
                          summaryInfo: {
                            summaryId: interval.summaryId,
                            projectId: props.selectedProject.projectId,
                            fieldType: 'Actual',
                          },
                        },
                      ]}
                    />
                  );
                })}
            </div>
            {detailList.map((item) => {
              return (
                <div className={`${ROOT}__detail-row`}>
                  {item.breakdowns.concat(addedCols).map((interval) => {
                    const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                    const colClass = today.isAfter(endDate)
                      ? '#eeeeee'
                      : '#ffffff';
                    let formattedIntervalActual = FormatUtil.formatNumber(
                      interval.actualAmt,
                      currencyDecimal
                    );
                    let isClickable = true;
                    let clickFunction = () => {
                      showTable(interval.breakDownId);
                    };
                    if (interval === '-') {
                      formattedIntervalActual = '';
                      isClickable = false;
                      clickFunction = null;
                    }
                    return (
                      <GridColumn
                        activeCellId={activeCellId}
                        setActiveCellId={setActiveCellId}
                        updatePosition={onPositionUpdate}
                        items={[
                          {
                            id: interval.breakDownId,
                            value: formattedIntervalActual,
                            background: colClass,
                            onClickable: isClickable,
                            onClick: clickFunction,
                            noteId: interval.actualAmtNoteId,
                            detailInfo: {
                              summaryId: interval.summaryId,
                              breakdownId: interval.breakDownId,
                              fieldType: 'ActualAmt',
                            },
                          },
                        ]}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className={`${ROOT}__right`}>
          <div className={`${ROOT}__right-content`}>
            <StyledBasicCell
              title={msg().Psa_Lbl_FinanceEAC}
              width="100%"
              height="50px"
              textAlign="center"
            >
              {msg().Psa_Lbl_FinanceEAC}
            </StyledBasicCell>
            <StyledBasicCell
              width="100%"
              height="25px"
              textAlign="center"
              divider
            >
              {workingDays.total}
            </StyledBasicCell>
            <div>
              {summary && (
                <GridColumn
                  items={[
                    {
                      value: FormatUtil.formatNumber(
                        summary.totalPlanned,
                        currencyDecimal
                      ),
                      background: '#f3e1ad',
                    },
                    {
                      value: FormatUtil.formatNumber(
                        summary.totalActual,
                        currencyDecimal
                      ),
                    },
                  ]}
                  width="100%"
                />
              )}
              {detailList.map((item) => {
                return (
                  <div className={`${ROOT}__eac-row`}>
                    <GridColumn
                      items={[
                        {
                          value: FormatUtil.formatNumber(
                            item.totalActual,
                            currencyDecimal
                          ),
                          background: '#fff',
                        },
                      ]}
                      width="100%"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {tableVisibility && breakDown && (
        <div className={`${ROOT}__table`}>
          {renderTableHeader()}
          {renderTable()}
        </div>
      )}
    </div>
  );
};

export default FinanceDetailOtherExpense;
