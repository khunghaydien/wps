import React from 'react';

import { Report } from '../../../../../domain/models/exp/Report';

import FormatUtil from '../../../../utils/FormatUtil';

import iconPreRequest from '../../../../images/Request.svg';
import msg from '../../../../languages';
import MultiColumnsGrid from '../../../MultiColumnsGrid';

import './index.scss';

const ROOT = 'ts-expenses__form-pre-request-summary';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  preRequest: Report;
  openRequestReportPage: (id?: string) => void;
};

export default class PreRequestSummary extends React.Component<Props> {
  openRequestReportTab = () => {
    const { openRequestReportPage, preRequest } = this.props;
    openRequestReportPage(preRequest.reportId);
  };

  render() {
    const { preRequest, baseCurrencySymbol, baseCurrencyDecimal } = this.props;
    const formattedTotalAmount = FormatUtil.formatNumber(
      preRequest.totalAmount,
      baseCurrencyDecimal
    );
    const Icon = iconPreRequest;
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__title`}>
          <Icon />
          <span>{msg().Exp_Lbl_ExpRequest}</span>
        </div>
        <div className={`${ROOT}__body`}>
          <MultiColumnsGrid sizeList={[3, 6, 3]}>
            <div className={`${ROOT}__label`}>
              {`${msg().Appr_Lbl_TAndERequestNumber}: `}
              <span
                className={`${ROOT}__report-no`}
                onClick={this.openRequestReportTab}
              >
                {preRequest.reportNo || ''}
              </span>
            </div>
            <div className={`${ROOT}__label`}>
              {`${msg().Exp_Clbl_ReportTitle}: `}
              {preRequest.subject}
            </div>
            <div className={`${ROOT}__label-amount`}>
              {`${msg().Exp_Clbl_EstimatedAmount} :`}
              {`${baseCurrencySymbol} ${formattedTotalAmount}`}
            </div>
          </MultiColumnsGrid>
          <MultiColumnsGrid sizeList={[12]}>
            <div className={`${ROOT}__label`}>
              {`${msg().Exp_Clbl_Purpose}:`}
              {preRequest.purpose}
            </div>
          </MultiColumnsGrid>
        </div>
      </div>
    );
  }
}
