/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from 'react';

import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import FinanceToggleView from '@apps/commons/components/psa/ToggleView';
import DownloadIcon from '@apps/commons/images/icons/download.svg';
import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import { downloadTnmContractAsCSV } from '@apps/commons/utils/psa/ProjectFinanceUtil';

import ProjectInformationHeaderContainer from '@apps/psa-pc/containers/ProjectInformationHeaderContainer';

import ActivityEACList from '@psa/components/FinanceDetails/Activity/ActivityEAC';
import ActivityGridColumnList from '@psa/components/FinanceDetails/Activity/ActivityGrid';
import ActivityTitleList from '@psa/components/FinanceDetails/Activity/ActivityTitle';
import StyledBasicCell from '@psa/components/FinanceGrid/BasicCell';
import GridColumn from '@psa/components/FinanceGrid/GridColumn';
import TitleColumn from '@psa/components/FinanceGrid/TitleColumn';

import useNote from '@apps/psa-pc/hooks/useNote';

import './index.scss';

export type Props = {
  projectDetail: Array<any>;
  currencyDecimal: number;
  currencySymbol: string;
  selectedProject: any;
  onSelectWeeklyMonthlyView: (intervalType: string) => void;
  contractTnMData: any;
  onRoleClick: (id: string) => void;
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
};

export const ROOT = 'ts-psa__finance-detail-tnm';

const FinanceDetailContractTnM = (props: Props) => {
  const [selectedView, setSelectedView] = useState('Monthly');
  const [activeCellId, setActiveCellId] = useState('');

  const [memo, updateMemo] = useNote();
  const [summaryInfo, setSummaryInfo] = useState({});
  const [detailInfo, setDetailInfo] = useState({});

  // for auto fill columns
  const [addedCols, setAddedCols] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);

  // ref for texarea memo input
  const inputRef = useRef(null);

  // constants
  const {
    currencyDecimal,
    contractTnMData,
    currencySymbol,
    workingDays,
    selectedProject,
  } = props;
  const { workdays, total } = workingDays;
  const { finances } = contractTnMData;

  // @ts-ignore
  const today = moment();
  const isJapanLocale = window.empInfo.language === 'ja';
  const monthlyDateFormat = isJapanLocale ? 'YYYY/MM' : 'MMM YYYY';

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (
      document.querySelector('.ts-psa__finance-detail-tnm__main-grid') &&
      finances
    ) {
      const mainGridElement = document.querySelector(
        '.ts-psa__finance-detail-tnm__main-grid'
      );
      const elementWidth =
        (mainGridElement as any).offsetWidth -
        finances.intervalTotals.length * 112;
      const noOfCols = Math.ceil(elementWidth / 112);
      if (noOfCols >= 0) {
        setAddedCols(Array(noOfCols).fill('-'));
      } else {
        setAddedCols([]);
      }
    }
  }, [width, finances.intervalTotals]);

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

  // event handlers
  const handleResize = () => {
    setWidth(window.innerWidth);
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

  // dynamic style constant
  const memoStyle = {
    position: 'absolute',
    maxWidth: '200px',
    minHeight: '100px',
    left: memo.memoPosition.x,
    top: memo.memoPosition.y,
    zIndex: '999',
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
      <PSACommonHeader title={contractTnMData.financeCategoryName}>
        <Button
          className={`${ROOT}__download-btn`}
          data-testid={`${ROOT}__download-btn`}
          onClick={() => {
            downloadTnmContractAsCSV(
              workingDays,
              contractTnMData,
              selectedView
            );
          }}
        >
          <DownloadIcon className={`${ROOT}__download-icon`} />
        </Button>
        <FinanceToggleView
          planningCycle={selectedProject.planningCycle}
          onSelectWeeklyMonthlyView={props.onSelectWeeklyMonthlyView}
          setSelectedView={setSelectedView}
        />
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
              id={'contractTnmTitle'}
              title={contractTnMData.financeCategoryName}
              background={'#fff5d9'}
              items={[
                {
                  id: 'contract-tnm-plan',
                  name: msg().Psa_Lbl_FinancePlan,
                  className: 'left-title-shade',
                },
                {
                  id: 'contract-tnm-actual',
                  name: msg().Psa_Lbl_FinanceActual,
                  divider: true,
                },
              ]}
              mergedRows={2}
              divider
            />
            {
              <ActivityTitleList
                activityData={finances.activities}
                onRoleClick={props.onRoleClick}
              />
            }
          </div>
        </div>
        <div
          className={`${ROOT}__main-grid ${
            memo.memoVisibility === 'visible' ? 'scrollDisable' : ''
          }`}
        >
          <div className={`${ROOT}__main-grid-header-container`}>
            {finances.intervalTotals &&
              finances.intervalTotals.concat(addedCols).map((total, index) => {
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
                let formattedStartDate: any =
                  startDate.format(monthlyDateFormat);
                if (selectedView === 'Weekly') {
                  let startDay = `${startDate.format('D')}`;
                  if (endDate.format('MM') !== startDate.format('MM')) {
                    startDay = `${startDate.format('D MMM')}`;
                  }
                  const endDay = `${endDate.format('D MMM')}`;
                  formattedStartDate = `${startDay} - ${endDay}`;
                }
                if (total === '-') {
                  const intialLength = finances.intervalTotals.length;
                  formattedStartDate = moment(
                    finances.intervalTotals[intialLength - 1].startDate,
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
              {finances.intervalTotals &&
                finances.intervalTotals.concat(addedCols).map((interval) => {
                  const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                  const colClass = today.isAfter(endDate) ? '#f6dfc4' : '';
                  const shadedColor = today.isAfter(endDate)
                    ? '#edc89d'
                    : '#f3e1ad';

                  let formattedPlannedValue = FormatUtil.formatNumber(
                    interval.plannedTnMAmt,
                    currencyDecimal
                  );
                  let formattedActualValue = FormatUtil.formatNumber(
                    interval.actualTnMAmt,
                    currencyDecimal
                  );
                  if (interval === '-') {
                    formattedPlannedValue = '';
                    formattedActualValue = '';
                  }

                  return (
                    <GridColumn
                      setActiveCellId={setActiveCellId}
                      activeCellId={activeCellId}
                      items={[
                        {
                          id: interval.summaryId + '_Planned',
                          value: formattedPlannedValue,
                          background: shadedColor,
                          noteId: interval.plannedTnMAmtNoteId,
                          summaryInfo: {
                            summaryId: interval.summaryId,
                            projectId: props.selectedProject.projectId,
                            fieldType: 'Planned',
                            isActivity: false,
                          },
                        },
                        {
                          id: interval.summaryId + '_Actual',
                          value: formattedActualValue,
                          divider: true,
                          background: colClass,
                          noteId: interval.actualTnMAmtNoteId,
                          summaryInfo: {
                            summaryId: interval.summaryId,
                            projectId: props.selectedProject.projectId,
                            fieldType: 'Actual',
                            isActivity: false,
                          },
                        },
                      ]}
                      updatePosition={onPositionUpdate}
                    />
                  );
                })}
            </div>

            {
              <ActivityGridColumnList
                activityData={finances.activities}
                currencyDecimal={currencyDecimal}
                currencySymbol={currencySymbol}
                addedCols={addedCols}
                activeCellId={activeCellId}
                setActiveCellId={setActiveCellId}
                updatePosition={onPositionUpdate}
              />
            }
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
            {total}
          </StyledBasicCell>
          <div className={`${ROOT}__right-content`}>
            {finances && (
              <GridColumn
                items={[
                  {
                    id: 'eac-contract-tnm-total-plan',
                    value: FormatUtil.formatNumber(
                      finances.totalTnMPlanned,
                      currencyDecimal
                    ),
                    background: '#f3e1ad',
                  },
                  {
                    id: 'eac-contract-tnm-total-actual',
                    value: FormatUtil.formatNumber(
                      finances.totalTnMActual,
                      currencyDecimal
                    ),
                    divider: true,
                  },
                ]}
                width="100%"
              />
            )}
            {
              <ActivityEACList
                activityData={finances.activities}
                currencyDecimal={currencyDecimal}
                currencySymbol={currencySymbol}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDetailContractTnM;
