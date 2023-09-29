import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { State } from '@mobile/modules';

import Component from '@mobile/components/pages/expense/Report/Detail/PrintReport';

type OwnProps = {
  id: string;
  getSelectedReportType: () => void;
};

const mapStateToProps = (state: State) => ({
  report: state.expense.entities.report,
  userSetting: state.userSetting,
  selectedReportType: state.expense.entities.selectedReportType,
});

const ReportPrintContainer = ({ id, getSelectedReportType }: OwnProps) => {
  const props = useSelector(mapStateToProps);

  useEffect(() => {
    if (props.report.expReportTypeId) {
      getSelectedReportType();
    }
  }, [props.report.expReportTypeId]);

  return <Component id={id} {...props} />;
};

export default ReportPrintContainer;
