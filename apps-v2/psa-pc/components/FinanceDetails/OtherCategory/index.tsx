/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import FinanceToggleView from '@apps/commons/components/psa/ToggleView';
import DownloadIcon from '@apps/commons/images/icons/download.svg';
import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import { downloadOtherCategoryAsCSV } from '@apps/commons/utils/psa/ProjectFinanceUtil';

import ProjectInformationHeaderContainer from '@apps/psa-pc/containers/ProjectInformationHeaderContainer';

import StyledBasicCell from '@psa/components/FinanceGrid/BasicCell';
import GridColumn from '@psa/components/FinanceGrid/GridColumn';
import TitleColumn from '@psa/components/FinanceGrid/TitleColumn';

import useNote from '@apps/psa-pc/hooks/useNote';

import './index.scss';

export type Props = {
  currencyDecimal: number;
  selectedProject: any;
  currencySymbol: string;
  otherCategoryData: any;
  workingDays: any;
  onSelectWeeklyMonthlyView: (arg0: string) => void;
  onSaveChanges: (param: any, intervalType: string) => void;
  onDeleteDetails: (param: any, intervalType: string) => void;
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
};

export const ROOT = 'ts-psa__finance-detail-other';

const FinanceDetailOtherCategory = (props: Props) => {
  const { currencyDecimal, otherCategoryData, workingDays, selectedProject } =
    props;
  const { summary, financeDetails } = otherCategoryData;
  const [editable, setEditable] = useState(false);

  const [detailList, setDetailList] = useState(financeDetails);
  const [selectedDetailList, setSelectedDetailList] = useState([]);
  const [summaryList, setSummaryList] = useState(summary);
  const [activeCellId, setActiveCellId] = useState('');
  const [selectedView, setSelectedView] = useState('Monthly');
  const [width, setWidth] = useState(window.innerWidth);
  const [addedCols, setAddedCols] = useState([]);
  const [memo, updateMemo] = useNote();
  const [summaryInfo, setSummaryInfo] = useState({});
  const [detailInfo, setDetailInfo] = useState({});

  // Created a new param state as i want to decouple the rendering and controlling of frontEnd componenents of the detail list from the redux state
  // This is because the redux state can never be in synced with all the componenets as adding a new memo will not save the edit cell values. To work around this
  // We can use this new param object, to handle rendering of componenets once the details has been populated either on user editing a cell, or when a user adds/deletes new row
  // This param object is resetted on save or on cancel, which is why we still need detailList for the inital rendering of cells as it will always take in the updated redux state after onchange or ondelete
  const [param, setParam] = useState({
    projectId: summaryList.projectId,
    financeCategoryId: summaryList.financeCategoryId,
    summaries: [],
    details: [],
  });
  const detailToMap = param.details.length === 0 ? detailList : param.details;
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
    setDetailList(financeDetails);
  }, [financeDetails]);

  useEffect(() => {
    setSummaryList(summary);
  }, [summary]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setDetailList(financeDetails);
    setSummaryList(summary);
  }, [summary, financeDetails]);

  useEffect(() => {
    if (memo.memoVisibility === 'visible') {
      inputRef.current.focus();
    } else {
      updateMemo.updateValue('');
    }
  }, [memo.memoVisibility]);

  useEffect(() => {
    updateMemo.updateValue(props.memo);
  }, [props.memo]);

  useEffect(() => {
    setSummaryList(summary);
    setDetailList(financeDetails);
  }, [summary]);

  useEffect(() => {
    if (
      document.querySelector('.ts-psa__finance-detail-other__main-grid') &&
      summary
    ) {
      const mainGridElement = document.querySelector(
        '.ts-psa__finance-detail-other__main-grid'
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

  // event handlers
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

  const resetCellValue = () => {
    setDetailList(financeDetails);
    setSummaryList(summary);
    setEditable(false);
    setParam({
      projectId: summaryList.projectId,
      financeCategoryId: summaryList.financeCategoryId,
      summaries: [],
      details: [],
    });
  };

  const preProcessParam = () => {
    let detailListToMap =
      param.details.length === 0 ? detailList : param.details;
    detailListToMap = detailListToMap.map((item) => {
      if (item.detailName === '') {
        return {
          ...item,
          detailName: 'Default',
        };
      }
      return item;
    });
    const newDetailList = detailListToMap.map((item) => {
      if (item.detailId.includes('temp-')) {
        const newBreakdowns = item.breakdowns.map((cellItem) => {
          return {
            ...cellItem,
            breakDownId: null,
          };
        });
        return {
          ...item,
          detailId: null,
          breakdowns: newBreakdowns,
        };
      } else {
        return item;
      }
    });
    return {
      projectId: param.projectId,
      financeCategoryId: param.financeCategoryId,
      summaries:
        param.summaries.length !== 0
          ? [...param.summaries]
          : [...summaryList.intervalTotals],
      details: [...newDetailList],
    };
  };
  const saveChanges = () => {
    setEditable(false);
    setActiveCellId('');
    props.onSaveChanges(preProcessParam(), selectedView);
    setParam({
      projectId: summaryList.projectId,
      financeCategoryId: summaryList.financeCategoryId,
      summaries: [],
      details: [],
    });
  };

  const deleteSelectedItem = () => {
    const financeDetailIds = selectedDetailList.filter(
      (id) => !id.includes('temp-')
    );
    const DeleteParam = {
      projectId: summaryList.projectId,
      financeCategoryId: summaryList.financeCategoryId,
      financeDetailIds,
    };
    if (param.details.length !== 0) {
      setParam((oldParam) => {
        return {
          ...oldParam,
          details: oldParam.details.filter(
            (detail) => !selectedDetailList.includes(detail.detailId)
          ),
        };
      });
    }
    if (financeDetailIds.length !== 0) {
      props.onDeleteDetails(DeleteParam, selectedView);
    }
  };

  const onChangeSummaryCellValue = (id: string, value: string) => {
    let itemIndex;
    const newSummaryListIntervalTotals =
      param.summaries.length === 0
        ? cloneDeep(summaryList.intervalTotals)
        : cloneDeep(param.summaries);

    // const newDetailList = cloneDeep(detailList);
    const summaryId = id.slice(0, id.indexOf('_'));

    newSummaryListIntervalTotals.forEach((item, i) => {
      if (item.summaryId === summaryId) {
        itemIndex = i;
      }
    });
    newSummaryListIntervalTotals[itemIndex].plannedAmt = value;
    setParam((oldParam) => {
      return { ...oldParam, summaries: newSummaryListIntervalTotals };
    });
  };

  const selectDetail = (detailId: string, value: boolean) => {
    const newSelectedList = [...selectedDetailList];
    if (value) {
      newSelectedList.push(detailId);
      setSelectedDetailList(newSelectedList);
    } else {
      const index = newSelectedList.indexOf(detailId);
      if (index > -1) {
        newSelectedList.splice(index, 1);
        setSelectedDetailList(newSelectedList);
      }
    }
  };

  const onChangeDetailName = (detailId: string, value: string) => {
    let itemIndex;

    if (param.details.length === 0) {
      const newDetailList = cloneDeep(detailList);
      newDetailList.forEach((item, i) => {
        if (item.detailId === detailId) {
          itemIndex = i;
        }
      });
      newDetailList[itemIndex].detailName = value;
      setDetailList(newDetailList);

      setParam((oldParam) => {
        return {
          ...oldParam,
          details: newDetailList,
        };
      });
    } else {
      const newParamDetailList = cloneDeep(param.details);
      newParamDetailList.forEach((item, i) => {
        if (item.detailId === detailId) {
          itemIndex = i;
        }
      });
      newParamDetailList[itemIndex].detailName = value;
      setParam((oldParam) => {
        return {
          ...oldParam,
          details: newParamDetailList,
        };
      });
      setDetailList(newParamDetailList);
    }
  };

  const onChangeDetailCellValue = (
    detailId: string,
    breakDownId: string,
    value: string
  ) => {
    let itemIndex;
    const newDetailList =
      param.details.length === 0
        ? cloneDeep(detailList)
        : cloneDeep(param.details);
    newDetailList.forEach((item, i) => {
      if (item.detailId === detailId) {
        itemIndex = i;
      }
    });
    let cellIndex;
    newDetailList[itemIndex].breakdowns.forEach((interval, i) => {
      if (interval.breakDownId === breakDownId) {
        cellIndex = i;
      }
    });
    newDetailList[itemIndex].breakdowns[cellIndex].actualAmt = value;
    setParam((oldParam) => {
      return { ...oldParam, details: newDetailList };
    });
  };

  const generateUniqueId = () =>
    String(Date.now().toString(32) + Math.random().toString(16)).replace(
      /\./g,
      ''
    );
  const generateNewRow = () => {
    setDetailList([
      ...detailList,
      {
        detailId: `temp-detail-${generateUniqueId()}`,
        detailName: '',
        totalActual: 0,
        breakdowns: summary.intervalTotals.map((item) => {
          return {
            breakDownId: `temp-${item.summaryId}-${detailList.length + 1}`,
            summaryId: item.summaryId,
            startDate: item.startDate,
            endDate: item.endDate,
            actualAmt: 0,
          };
        }),
      },
    ]);
    const detailToConcat =
      param.details.length === 0 ? detailList : param.details;

    setParam((oldParam) => {
      return {
        ...oldParam,
        details: detailToConcat.concat({
          detailId: `temp-detail-${generateUniqueId()}`,
          detailName: '',
          totalActual: 0,
          breakdowns: summary.intervalTotals.map((item) => {
            return {
              breakDownId: `temp-${item.summaryId}-${detailList.length + 1}`,
              summaryId: item.summaryId,
              startDate: item.startDate,
              endDate: item.endDate,
              actualAmt: 0,
            };
          }),
        }),
      };
    });
  };

  const handleResize = () => {
    setWidth(window.innerWidth);
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
        {!editable && (
          <Button
            className={`${ROOT}__download-btn`}
            data-testid={`${ROOT}__download-btn`}
            onClick={() => {
              downloadOtherCategoryAsCSV(
                workingDays,
                otherCategoryData,
                selectedView
              );
            }}
          >
            <DownloadIcon className={`${ROOT}__download-icon`} />
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
            data-testid={`${ROOT}__btn--delete`}
            className={`${ROOT}__btn--delete`}
            onClick={() => {
              deleteSelectedItem();
            }}
          >
            {msg().Com_Btn_Delete}
          </Button>
        )}
        {editable && (
          <Button
            data-testid={`${ROOT}__btn--add-row`}
            className={`${ROOT}__btn--add-row`}
            onClick={() => generateNewRow()}
          >
            {msg().Psa_Lbl_AddRow}
          </Button>
        )}
        {editable && (
          <Button
            data-testid={`${ROOT}__btn--cancel`}
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
            data-testid={`${ROOT}__btn--save`}
            className={`${ROOT}__btn--save`}
            type="primary"
            onClick={() => {
              saveChanges();
            }}
          >
            {msg().Com_Btn_Save}
          </Button>
        )}
        {!editable && (
          <FinanceToggleView
            selectedView={selectedView}
            planningCycle={selectedProject.planningCycle}
            onSelectWeeklyMonthlyView={props.onSelectWeeklyMonthlyView}
            setSelectedView={(value) => setSelectedView(value)}
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
          >
            <div className={`${ROOT}__left-title`}>
              <div>{msg().Psa_Lbl_LegendDetails}</div>
            </div>
          </TitleColumn>
          <div className={`${ROOT}__left-content`}>
            <TitleColumn
              id={'otherCategoryTitle'}
              title={summary.financeCategoryName}
              background={'#fff5d9'}
              items={[
                {
                  id: 'other-category-plan',
                  name: msg().Psa_Lbl_FinancePlan,
                  className: 'left-title-shade',
                },
                {
                  id: 'other-category-actual',
                  name: msg().Psa_Lbl_FinanceActual,
                },
              ]}
              mergedRows={2}
            />
            {detailToMap.map((item) => {
              return (
                <TitleColumn
                  key={item.detailId}
                  title={item.detailName || '-'}
                  fontWeight={'normal'}
                  items={[{ name: msg().Psa_Lbl_FinanceActual }]}
                  mergedRows={1}
                  padding={'0 0 0 10px'}
                  cellClassName={`${ROOT}__detail-name`}
                >
                  {editable ? (
                    <span className={`${ROOT}__category-name`}>
                      <input
                        type="checkbox"
                        title=""
                        name="isDetailChecked"
                        className={`${ROOT}__checkbox`}
                        value={item.detailId}
                        onChange={(e) =>
                          selectDetail(item.detailId, e.target.checked)
                        }
                        checked={selectedDetailList.includes(item.detailId)}
                      />
                      <StyledBasicCell
                        id={item.detailId}
                        title={item.detailName}
                        width={'100%'}
                        textAlign="left"
                        padding="0 0 0 0"
                        cellType={'string'}
                        editable={editable}
                        activeCellId={activeCellId}
                        setActiveCellId={setActiveCellId}
                        onChangeCellValue={onChangeDetailName}
                        noBorder
                      >
                        {item.detailName}
                      </StyledBasicCell>
                    </span>
                  ) : null}
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
                let formattedStartDate = startDate.format(monthlyDateFormat);
                if (selectedView === 'Weekly') {
                  let startDay = `${startDate.format('D')}`;
                  if (endDate.format('MM') !== startDate.format('MM')) {
                    startDay = `${startDate.format('D MMM')}`;
                  }
                  const endDay = `${endDate.format('D MMM')}`;
                  formattedStartDate = `${startDay} - ${endDay}`;
                }
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
                  <div
                    className={`${ROOT}__main-grid-header-cells`}
                    key={total.summaryId}
                  >
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
              {summaryList.intervalTotals &&
                summaryList.intervalTotals.concat(addedCols).map((interval) => {
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
                  let isCellEditable = editable;

                  if (interval === '-') {
                    formattedPlannedValue = '';
                    formattedActualValue = '';
                    isCellEditable = false;
                  }

                  return (
                    <GridColumn
                      key={interval.summaryId}
                      activeCellId={activeCellId}
                      setActiveCellId={setActiveCellId}
                      onChangeCellValue={(id, value) => {
                        onChangeSummaryCellValue(id, value);
                      }}
                      updatePosition={onPositionUpdate}
                      items={[
                        {
                          id: interval.summaryId + '_Planned',
                          value: !isCellEditable
                            ? formattedPlannedValue
                            : interval.plannedAmt,
                          background: shadedColor,
                          editable: isCellEditable,
                          allowNegative:
                            summary.recordType?.value === 'OtherExpense',
                          noteId: interval.plannedAmtNoteId,
                          summaryInfo: {
                            summaryId: interval.summaryId,
                            projectId: props.selectedProject.projectId,
                            fieldType: 'Planned',
                            isDetails: false,
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
                            isDetails: false,
                          },
                        },
                      ]}
                    />
                  );
                })}
            </div>
            {detailToMap.map((item) => {
              return (
                <div className={`${ROOT}__detail-row`} key={item.detailId}>
                  {item.breakdowns.concat(addedCols).map((interval) => {
                    const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                    const colClass = today.isAfter(endDate)
                      ? '#eeeeee'
                      : '#ffffff';
                    let formattedIntervalActual = FormatUtil.formatNumber(
                      interval.actualAmt,
                      currencyDecimal
                    );
                    let isCellEditable = editable;
                    if (interval === '-') {
                      formattedIntervalActual = '';
                      isCellEditable = false;
                    }
                    return (
                      <GridColumn
                        key={interval.breakDownId}
                        activeCellId={activeCellId}
                        setActiveCellId={setActiveCellId}
                        onChangeCellValue={(id, value) =>
                          onChangeDetailCellValue(item.detailId, id, value)
                        }
                        updatePosition={onPositionUpdate}
                        items={[
                          {
                            id: interval.breakDownId,
                            value: !isCellEditable
                              ? formattedIntervalActual
                              : interval.actualAmt,
                            background: colClass,
                            editable: isCellEditable,
                            allowNegative:
                              summary.recordType?.value === 'OtherExpense',
                            noteId: interval.actualAmtNoteId,
                            detailInfo: {
                              summaryId: interval.summaryId,
                              breakdownId: interval.breakDownId,
                              fieldType: 'ActualAmt',
                              isDetails: true,
                              detailId: item.detailId,
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
              id="eacTitle"
              title={msg().Psa_Lbl_FinanceEAC}
              width="100%"
              height="50px"
              textAlign="center"
            >
              {msg().Psa_Lbl_FinanceEAC}
            </StyledBasicCell>
            <StyledBasicCell
              id="eacWorkingDaysTotal"
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
                      id: 'eac-other-total-plan',
                      value: FormatUtil.formatNumber(
                        summary.totalPlanned,
                        currencyDecimal
                      ),
                      background: '#f3e1ad',
                    },
                    {
                      id: 'eac-other-total-actual',
                      value: FormatUtil.formatNumber(
                        summary.totalActual,
                        currencyDecimal
                      ),
                    },
                  ]}
                  width="100%"
                />
              )}
              {detailToMap.map((item) => {
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
    </div>
  );
};

export default FinanceDetailOtherCategory;
