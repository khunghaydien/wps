import React from 'react';

import Button from '../../commons/components/buttons/Button';
import PopupWindowNavbar from '../../commons/components/PopupWindowNavbar';
import PopupWindowPage from '../../commons/components/PopupWindowPage';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import msg from '../../commons/languages';

import { AttDailyAttention } from '../../domain/models/attendance/AttDailyAttention';
import { Record } from '../models/Record';
import { SummaryBlock } from '../models/SummaryBlock';

import TimesheetSummary from './TimesheetSummary';

export type Props = {
  summaryName: string;
  status?: string;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
  records: Record[];
  attentions: {
    [key: string]: AttDailyAttention[];
  };
  summaries: SummaryBlock[];
  restTimeTotal: number;
  realWorkTimeTotal: number;
  overTimeTotal: number;
  nightTimeTotal: number;
  virtualWorkTimeTotal: number;
  holidayWorkTimeTotal: number;
  lostTimeTotal: number;
  onClickPrintButton: () => void;
  closingDate?: string;
};

export default class App extends React.Component<Props> {
  static defaultProps = {
    closingDate: '',
    status: '',
  };

  render() {
    return (
      <GlobalContainer>
        <PopupWindowNavbar title={msg().Att_Lbl_MonthlySummary}>
          <Button type="text" onClick={this.props.onClickPrintButton}>
            {msg().Com_Btn_Print}
          </Button>
        </PopupWindowNavbar>
        <PopupWindowPage>
          <TimesheetSummary
            summaryName={this.props.summaryName}
            status={this.props.status || ''}
            departmentName={this.props.departmentName}
            workingTypeName={this.props.workingTypeName}
            employeeCode={this.props.employeeCode}
            employeeName={this.props.employeeName}
            records={this.props.records}
            attentions={this.props.attentions}
            summaries={this.props.summaries}
            closingDate={this.props.closingDate || ''}
            restTimeTotal={this.props.restTimeTotal}
            realWorkTimeTotal={this.props.realWorkTimeTotal}
            overTimeTotal={this.props.overTimeTotal}
            nightTimeTotal={this.props.nightTimeTotal}
            virtualWorkTimeTotal={this.props.virtualWorkTimeTotal}
            holidayWorkTimeTotal={this.props.holidayWorkTimeTotal}
            lostTimeTotal={this.props.lostTimeTotal}
          />
        </PopupWindowPage>
      </GlobalContainer>
    );
  }
}
