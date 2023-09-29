import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import PopupWindowNavbar from '../../../commons/components/PopupWindowNavbar';
import PopupWindowPage from '../../../commons/components/PopupWindowPage';
import GlobalContainer from '../../../commons/containers/GlobalContainer';
import msg from '../../../commons/languages';

import { State } from '@attendance/timesheet-pc-summary/modules/entities/summary';

import TimesheetSummary from './TimesheetSummary';

export type Props = {
  summaryName: string;
  status: State['status'];
  ownerInfos: State['ownerInfos'];
  workingType: State['workingType'];
  records: State['records'];
  recordTotal: State['recordTotal'];
  summaries: State['summaries'];
  dividedSummaries: State['dividedSummaries'];
  onClickPrintButton: () => void;
  onRequestOpenAllowanceWindow: (event: React.MouseEvent) => void;
  onRequestOpenObjectivelyEventLogWindow: (event: React.MouseEvent) => void;
  onRequestOpenRestReasonWindow: (event: React.MouseEvent) => void;
  masked: boolean;
};

export default class App extends React.Component<Props> {
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
            status={this.props.status}
            ownerInfos={this.props.ownerInfos}
            workingType={this.props.workingType}
            records={this.props.records}
            recordTotal={this.props.recordTotal}
            summaries={this.props.summaries}
            dividedSummaries={this.props.dividedSummaries}
            onRequestOpenAllowanceWindow={
              this.props.onRequestOpenAllowanceWindow
            }
            onRequestOpenObjectivelyEventLogWindow={
              this.props.onRequestOpenObjectivelyEventLogWindow
            }
            onRequestOpenRestReasonWindow={
              this.props.onRequestOpenRestReasonWindow
            }
            masked={this.props.masked}
          />
        </PopupWindowPage>
      </GlobalContainer>
    );
  }
}
