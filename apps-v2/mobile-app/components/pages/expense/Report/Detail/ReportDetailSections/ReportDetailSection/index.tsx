import React, { ReactNode } from 'react';

import './index.scss';

interface IReportDetailSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const ReportDetailSection = ({
  children,
  title,
  id,
  defaultOpen = false,
}: IReportDetailSectionProps) => (
  <div className="report-detail-section-tab">
    <input defaultChecked={defaultOpen} type="checkbox" id={id} />
    <label className="report-detail-section-tab-label" htmlFor={id}>
      {title}
    </label>
    <div className="report-detail-section-tab-content">{children}</div>
  </div>
);

export default ReportDetailSection;
