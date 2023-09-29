import * as React from 'react';

import { AttDailyRecordContractedDetail } from '../../../../domain/models/attendance/AttDailyRecord';
import { TimeRange } from '../../../../domain/models/attendance/TimeRange';
import { UserSetting } from '../../../../domain/models/UserSetting';
import AttRecordModel from '../../../models/AttRecord';
import DailyRequestConditionsModel from '../../../models/DailyRequestConditions';
import { DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel } from '@apps/domain/models/attendance/DailyActualWorkingTimePeriod';

import DailyRow from './DailyRow';
import HeadingRow from './HeadingRow';

import './index.scss';

const WIDTH_PX_OF_ONE_HOUR = 20;
const WIDTH_PX_OF_CHART_BODY = WIDTH_PX_OF_ONE_HOUR * (1 + 24 * 2 + 1);

const ROOT = 'timesheet-pc-main-content-timesheet';

type State = {
  chartLeft: number;
};

type Props = {
  onClickRequestButton: (arg0: DailyRequestConditionsModel) => void;
  onClickTimeButton: (arg0: AttRecordModel) => void;
  onClickRemarksButton: (arg0: AttRecordModel) => void;
  onClickAttentionsButton: (arg0: Array<string>) => void;
  onChangeCommuteCount: (param: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
    targetDate: string;
  }) => void;
  attRecordList: AttRecordModel[];
  dailyContractedDetailMap: { [date: string]: AttDailyRecordContractedDetail };
  dailyRequestedWorkingHoursMap: { [date: string]: TimeRange };
  dailyActualWorkingPeriodListMap: {
    [date: string]: DailyActualWorkingTimePeriodModel[];
  };
  dailyRequestConditionsMap: {
    [key: string]: DailyRequestConditionsModel;
  };
  dailyAttentionMessagesMap: Record<string, string[]>;
  useManageCommuteCount: boolean;
  isManHoursGraphOpened: boolean;
  userSetting: UserSetting;
};

export default class Timesheet extends React.Component<Props, State> {
  chartArea: any;
  chartAreaWidth: number | null;
  draggingMouseX: number | null;

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
  }

  componentDidMount() {
    this.calcChartAreaWidth();
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('mousemove', this.onDragChart);
    document.addEventListener('mouseup', this.onDragChartEnd);
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

  render() {
    const {
      attRecordList,
      dailyContractedDetailMap,
      dailyRequestedWorkingHoursMap,
      dailyActualWorkingPeriodListMap,
      dailyRequestConditionsMap,
      dailyAttentionMessagesMap,
      isManHoursGraphOpened,
    } = this.props;

    return (
      <div className={ROOT}>
        <table>
          <thead>
            <HeadingRow
              chartPositionLeft={this.state.chartLeft}
              onDragChartStart={this.onDragChartStart}
              useManageCommuteCount={this.props.useManageCommuteCount}
              isManHoursGraphOpened={isManHoursGraphOpened}
              setChartAreaRef={(elm) => {
                this.chartArea = elm;
              }}
              userSetting={this.props.userSetting}
            />
          </thead>
          <tbody>
            {attRecordList.map(
              (
                attRecord // $FlowFixMe v0.89
              ) => (
                <DailyRow
                  key={attRecord.recordDate}
                  attRecord={attRecord}
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
                  useManageCommuteCount={this.props.useManageCommuteCount}
                  isManHoursGraphOpened={isManHoursGraphOpened}
                  userSetting={this.props.userSetting}
                />
              )
            )}
          </tbody>
          <tfoot>
            <HeadingRow
              chartPositionLeft={this.state.chartLeft}
              onDragChartStart={this.onDragChartStart}
              useManageCommuteCount={this.props.useManageCommuteCount}
              isManHoursGraphOpened={isManHoursGraphOpened}
              userSetting={this.props.userSetting}
            />
          </tfoot>
        </table>
      </div>
    );
  }
}
