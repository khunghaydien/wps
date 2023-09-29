import * as React from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

import Spinner from '@apps/commons/components/Spinner';

import { UserSetting } from '../../../../../domain/models/UserSetting';
import AttRecordModel from '../../../models/AttRecord';
import DailyRequestConditionsModel from '../../../models/DailyRequestConditions';
import { AttDailyRecordContractedDetail } from '@attendance/domain/models/AttDailyRecord';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import { DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel } from '@attendance/domain/models/DailyActualWorkingTimePeriod';
import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { TimeRange } from '@attendance/domain/models/TimeRange';

import { State as TimesheetViewModel } from '@attendance/timesheet-pc/modules/entities/timesheet';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import DailyRow from './DailyRow';
import HeadingRow from './HeadingRow';
import modifierCssClassName from './helpers/modifierCssClassName';
import { TIMESHEET_VIEW_TYPE, TimesheetViewType } from './TimesheetViewType';

import './index.scss';

const WIDTH_PX_OF_ONE_HOUR = 20;
const WIDTH_PX_OF_CHART_BODY = WIDTH_PX_OF_ONE_HOUR * (1 + 24 * 2 + 1);

const ROOT = 'timesheet-pc-main-content-timesheet';

type State = {
  chartLeft: number;
  tableLeft: number;
};

const wrapper = (type: TimesheetViewType, node: React.ReactNode) => {
  if (type === TIMESHEET_VIEW_TYPE.TABLE) {
    return <div className={`${ROOT}__table-wrapper`}>{node}</div>;
  }
  return node;
};

type Props = {
  viewType: TimesheetViewType;
  onClickRequestButton: (arg0: DailyRequestConditionsModel) => void;
  onClickTimeButton: (arg0: string) => void;
  onClickRemarksButton: (arg0: AttRecordModel) => void;
  onClickAttentionsButton: (arg0: Array<string>) => void;
  onChangeCommuteCount: (
    targetDate: string,
    commuteCount: CommuteCount
  ) => void;
  today: string;
  attRecordList: AttRecordModel[];
  workingType: TimesheetViewModel['workingType'];
  workingTypes: TimesheetViewModel['workingTypes'];
  dailyObjectivelyEventLogList: DailyObjectivelyEventLog[];
  dailyContractedDetailMap: { [date: string]: AttDailyRecordContractedDetail };
  dailyRequestedWorkingHoursMap: { [date: string]: TimeRange };
  dailyActualWorkingPeriodListMap: {
    [date: string]: DailyActualWorkingTimePeriodModel[];
  };
  dailyRequestConditionsMap: {
    [key: string]: DailyRequestConditionsModel;
  };
  dailyAttentionMessagesMap: Record<string, string[]>;
  isManHoursGraphOpened: boolean;
  userSetting: UserSetting;
  loading: boolean;
  Containers: {
    HeadingRowFixedCellsContainer: React.ComponentType<
      React.ComponentProps<
        React.ComponentProps<typeof HeadingRow>['FixedCellsContainer']
      >
    >;
    HeadingRowTableCellsContainer: React.ComponentType<
      React.ComponentProps<
        React.ComponentProps<typeof HeadingRow>['TableCellsContainer']
      >
    >;
    DailyRowTableCellsContainer: React.ComponentType<
      React.ComponentProps<
        React.ComponentProps<typeof DailyRow>['TableCellsContainer']
      >
    >;
  };
};

const LocalSpinner = styled(Spinner)<{ left: number }>`
  top: 129px !important;
  left: ${({ left }) => `${left}px !important`};
`;

export default class Timesheet extends React.Component<Props, State> {
  chartArea: any;
  chartAreaWidth: number | null;
  draggingMouseX: number | null;
  headRef: any;

  static defaultProps = {
    attRecordList: [],
    dailyContractedDetailMap: {},
    dailyRequestedWorkingHoursMap: {},
    dailyActualWorkingPeriodListMap: {},
    dailyRequestConditionsMap: {},
    isManHoursGraphOpened: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      chartLeft: 0,
      tableLeft: 0,
    };

    // チャート部のドラッグ処理で使用する一時的な変数
    this.chartAreaWidth = null;
    this.draggingMouseX = null;

    // this.onClickToggleManHoursGraph = this.onClickToggleManHoursGraph.bind(this);

    this.calcChartAreaWidth = this.calcChartAreaWidth.bind(this);
    this.onDragChart = this.onDragChart.bind(this);
    this.onDragChartStart = this.onDragChartStart.bind(this);
    this.onDragChartEnd = this.onDragChartEnd.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.addModifierClassName = this.addModifierClassName.bind(this);

    this.headRef = React.createRef();
  }

  componentDidMount() {
    this.calcChartAreaWidth();
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('mousemove', this.onDragChart);
    document.addEventListener('mouseup', this.onDragChartEnd);
    const ref = this.headRef.current?.children[0].children;
    if (ref) {
      const left = ref[ref.length - 1].getBoundingClientRect().left;
      this.setState({ tableLeft: left });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('mousemove', this.onDragChart);
    document.removeEventListener('mouseup', this.onDragChartEnd);
  }

  onDragChartStart(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.draggingMouseX = e.pageX;
  }

  // documentにnativeのaddEventListenerで付与
  onDragChart(e: MouseEvent) {
    if (this.draggingMouseX === null) {
      return;
    }

    // 変化量を計算
    const moveX = -(this.draggingMouseX - e.pageX);
    this.changeChartPosition(moveX);
    this.draggingMouseX = e.pageX;
  }

  // documentにnativeのaddEventListenerで付与
  onDragChartEnd() {
    if (this.draggingMouseX === null) {
      return;
    }

    this.draggingMouseX = null;
  }

  // TODO: 工数カラム復活時に有効化する
  // onClickToggleManHoursGraph() {
  //   this.props.onClickToggleManHoursGraph();
  //
  //   // レイアウトが変更されるため、チャートエリアの再計算
  //   // FIXME setTimeoutはだめでは
  //   setTimeout(() => {
  //     const e = document.createEvent('HTMLEvents');
  //     e.initEvent('resize', true, true); // event type, bubbling, cancelable
  //     window.dispatchEvent(e);
  //   }, 350);
  // }

  onWindowResize() {
    // チャート領域の変動を確認し
    this.calcChartAreaWidth();
    // ポジションを再計算
    this.changeChartPosition(0);
  }

  // チャート表示エリアの幅を計算する。
  calcChartAreaWidth() {
    if (this.chartArea) {
      this.chartAreaWidth = this.chartArea.offsetWidth;
    }
  }

  // チャート部分の移動を行う
  changeChartPosition(x: number) {
    this.setState((prevState) => {
      let nextLeft = prevState.chartLeft + x;

      const minusLimit = -(WIDTH_PX_OF_CHART_BODY - (this.chartAreaWidth || 0));

      if (nextLeft < minusLimit) {
        nextLeft = minusLimit;
      } else if (nextLeft > 0) {
        nextLeft = 0;
      }

      return {
        chartLeft: nextLeft,
      };
    });
  }

  addModifierClassName(baseClassName: string) {
    return classNames(
      baseClassName,
      modifierCssClassName(
        baseClassName,
        this.props.viewType,
        this.props.workingType
      )
    );
  }

  render() {
    const {
      viewType,
      today,
      attRecordList,
      dailyObjectivelyEventLogList,
      dailyContractedDetailMap,
      dailyRequestedWorkingHoursMap,
      dailyActualWorkingPeriodListMap,
      dailyRequestConditionsMap,
      dailyAttentionMessagesMap,
      isManHoursGraphOpened,
    } = this.props;

    const useTableView = viewType === TIMESHEET_VIEW_TYPE.TABLE;

    return (
      <div className={this.addModifierClassName(ROOT)}>
        {wrapper(
          viewType,
          <table className={this.addModifierClassName(`${ROOT}__table`)}>
            <thead
              ref={this.headRef}
              className={this.addModifierClassName(`${ROOT}__table-head`)}
            >
              <HeadingRow
                viewType={viewType}
                chartPositionLeft={this.state.chartLeft}
                onDragChartStart={this.onDragChartStart}
                useFixDailyRequest={this.props.workingType?.useFixDailyRequest}
                isManHoursGraphOpened={isManHoursGraphOpened}
                setChartAreaRef={(elm) => {
                  this.chartArea = elm;
                }}
                FixedCellsContainer={
                  this.props.Containers.HeadingRowFixedCellsContainer
                }
                TableCellsContainer={
                  this.props.Containers.HeadingRowTableCellsContainer
                }
              />
            </thead>
            <tbody className={this.addModifierClassName(`${ROOT}__table-body`)}>
              {attRecordList.map(
                (
                  attRecord // $FlowFixMe v0.89
                ) => (
                  <DailyRow
                    key={attRecord.recordDate}
                    viewType={viewType}
                    today={today}
                    attRecord={attRecord}
                    dailyObjectivelyEventLog={dailyObjectivelyEventLogList?.find(
                      ({ recordId }) => recordId === attRecord.id
                    )}
                    contractedDetail={
                      dailyContractedDetailMap[attRecord.recordDate]
                    }
                    requestedWorkingHours={
                      dailyRequestedWorkingHoursMap[attRecord.recordDate]
                    }
                    actualWorkingPeriodList={
                      dailyActualWorkingPeriodListMap[attRecord.recordDate]
                    }
                    requestConditions={
                      dailyRequestConditionsMap[attRecord.recordDate]
                    }
                    attentionMessages={
                      dailyAttentionMessagesMap[attRecord.recordDate]
                    }
                    chartPositionLeft={this.state.chartLeft}
                    onClickRequestButton={this.props.onClickRequestButton}
                    onClickTimeButton={this.props.onClickTimeButton}
                    onClickRemarksButton={this.props.onClickRemarksButton}
                    onClickAttentionsButton={this.props.onClickAttentionsButton}
                    onChangeCommuteCount={this.props.onChangeCommuteCount}
                    onDragChartStart={this.onDragChartStart}
                    workingType={this.props.workingType}
                    dailyWorkingType={RecordsUtil.getWithinRange(
                      attRecord.recordDate,
                      this.props.workingTypes
                    )}
                    isManHoursGraphOpened={isManHoursGraphOpened}
                    userSetting={this.props.userSetting}
                    TableCellsContainer={
                      this.props.Containers.DailyRowTableCellsContainer
                    }
                  />
                )
              )}
            </tbody>
            {!useTableView && (
              <tfoot>
                <HeadingRow
                  viewType={viewType}
                  chartPositionLeft={this.state.chartLeft}
                  onDragChartStart={this.onDragChartStart}
                  isManHoursGraphOpened={isManHoursGraphOpened}
                  setChartAreaRef={(elm) => {
                    this.chartArea = elm;
                  }}
                  FixedCellsContainer={
                    this.props.Containers.HeadingRowFixedCellsContainer
                  }
                  TableCellsContainer={
                    this.props.Containers.HeadingRowTableCellsContainer
                  }
                />
              </tfoot>
            )}
          </table>
        )}
        <LocalSpinner
          loading={this.props.loading}
          left={this.state.tableLeft}
        />
      </div>
    );
  }
}
