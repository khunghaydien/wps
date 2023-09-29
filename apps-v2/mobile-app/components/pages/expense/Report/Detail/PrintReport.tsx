import React from 'react';

import PrintReport from '@apps/commons/components/exp/PrintReport';
import msg from '@apps/commons/languages';

import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import { Report } from '@apps/domain/models/exp/Report';
import { UserSetting } from '@apps/domain/models/UserSetting';

type Props = {
  id: string;
  report: Report;
  userSetting: UserSetting;
  selectedReportType: ExpenseReportType;
};

const ROOT = 'mobile-app-pages-report-detail__print';

const PrintReportComp = ({
  id,
  report,
  userSetting,
  selectedReportType,
}: Props) => {
  return (
    <div id={id} className={ROOT}>
      <div className={`${ROOT}-title`}>{msg().Exp_Lbl_ExpenseReport}</div>
      <hr className={`${ROOT}-element`} />
      <PrintReport
        report={report}
        userSetting={userSetting}
        selectedReportType={selectedReportType}
      />
    </div>
  );
};

export default PrintReportComp;
