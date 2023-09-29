import React from 'react';

import Button from '@apps/commons/components/buttons/Button';
import PrintReport from '@apps/commons/components/exp/PrintReport';
import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import msg from '@apps/commons/languages';

import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import { Report } from '@apps/domain/models/exp/Report';
import { UserSetting } from '@apps/domain/models/UserSetting';

import './index.scss';

export type Props = {
  onClickPrintButton: () => void;
  report: Report;
  userSetting: UserSetting;
  selectedReportType: ExpenseReportType;
};

const App = ({
  onClickPrintButton,
  report,
  userSetting,
  selectedReportType,
}: Props) => (
  <GlobalContainer>
    <Button type="default" onClick={onClickPrintButton}>
      {msg().Com_Btn_PrintDo}
    </Button>
    <div className="title">{msg().Exp_Lbl_ExpenseReport}</div>
    <hr className="element" />
    <PrintReport
      report={report}
      userSetting={userSetting}
      selectedReportType={selectedReportType}
    />
  </GlobalContainer>
);

export default App;
