import * as React from 'react';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import RefreshButton from '../../molecules/commons/Buttons/RefreshButton';
import DailyHeader from '../../molecules/commons/Headers/DailyHeader';
import { Tab, Tabs } from '../../molecules/commons/Tabs';

import './DailyLayout.scss';

const ROOT = 'mobile-app-components-organisms-attendance-daily-layout';

export const TABS = {
  workTimeInput: 0,
  request: 1,
};

export type Props = Readonly<{
  children: React.ReactNode;
  currentDate: string;
  startDate: string;
  title: string;
  tab: typeof TABS[keyof typeof TABS];
  disabledPrevDate?: boolean;
  disabledNextDate?: boolean;
  onChangeDate: (arg0: string) => void;
  onClickBackMonth: () => void;
  onClickPrevDate: () => void;
  onClickNextDate: () => void;
  onClickTimesheetDaily: () => void;
  onClickDailyRequest: () => void;
  onClickRefresh: () => void;
}>;

export default class DailyLayout extends React.Component<Props> {
  render() {
    const navActions = [
      <RefreshButton
        className={`${ROOT}__refresh`}
        testId={`${ROOT}__refresh`}
        onClick={this.props.onClickRefresh}
      />,
    ];
    return (
      <div className={ROOT}>
        <DailyHeader
          className={`${ROOT}__header`}
          currentDate={this.props.currentDate}
          title={this.props.title}
          backButtonLabel={DateUtil.formatYM(this.props.startDate)}
          disabledPrevDate={this.props.disabledPrevDate}
          disabledNextDate={this.props.disabledNextDate}
          onChangeDate={this.props.onChangeDate}
          onClickBackMonth={this.props.onClickBackMonth}
          onClickPrevDate={this.props.onClickPrevDate}
          onClickNextDate={this.props.onClickNextDate}
          actions={navActions}
        />
        <div className={`${ROOT}__container`}>{this.props.children}</div>
        <Tabs position="bottom">
          <Tab
            label={msg().Att_Lbl_WorkHours}
            onClick={this.props.onClickTimesheetDaily}
            active={this.props.tab === TABS.workTimeInput}
          />
          <Tab
            label={msg().Att_Lbl_Request}
            onClick={this.props.onClickDailyRequest}
            active={this.props.tab === TABS.request}
          />
        </Tabs>
      </div>
    );
  }
}
