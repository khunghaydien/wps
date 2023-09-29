import React from 'react';

import msg from '@apps/commons/languages';

import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import { Report } from '@apps/domain/models/exp/Report';
import { UserSetting } from '@apps/domain/models/UserSetting';

import Applicant from './Applicant';
import Content from './Content';
import Header from './Header';
import Records from './Records';

import './index.scss';

export type Props = {
  report: Report;
  selectedReportType: ExpenseReportType;
  userSetting: UserSetting;
};

const ROOT = 'expenses-pc-print-print-report';

const PrintReport = ({ report, userSetting, selectedReportType }: Props) => (
  <div className={ROOT}>
    <Header report={report} userSetting={userSetting} />
    <div className={`${ROOT}__subtitle`}>
      {msg().Exp_Lbl_RequestInformation}
    </div>
    <hr />
    <Applicant report={report} userSetting={userSetting} />
    <div className={`${ROOT}__subtitle`}>{msg().Exp_Lbl_RequestContents}</div>
    <hr />
    <Content report={report} selectedReportType={selectedReportType} />
    <div className={`${ROOT}__subtitle`}>{msg().Exp_Lbl_Records}</div>
    <hr />
    <Records
      report={report}
      userSetting={userSetting}
      selectedReportType={selectedReportType}
    />
  </div>
);

export default PrintReport;
