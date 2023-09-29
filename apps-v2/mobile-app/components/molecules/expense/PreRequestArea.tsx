import React from 'react';

import msg from '../../../../commons/languages';
import FormatUtil from '../../../../commons/utils/FormatUtil';
import ViewItem from '../commons/ViewItem';

import { Report } from '../../../../domain/models/exp/Report';

export type Props = Readonly<{
  preRequest?: Report;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  className?: string;
  withHeader?: boolean;
}>;

const PreRequestArea = (props: Props) => {
  const {
    preRequest,
    baseCurrencySymbol,
    baseCurrencyDecimal,
    className: ROOT = '',
    withHeader,
  } = props;
  const {
    totalAmount = 0,
    reportNo = '',
    purpose = '',
    subject = '',
  } = preRequest || {};
  const formattedTotalAmount = FormatUtil.formatNumber(
    totalAmount,
    baseCurrencyDecimal
  );
  return (
    <>
      {withHeader && (
        <div className={`${ROOT}__headline`}>
          <div className={`${ROOT}__title heading-2`}>
            {msg().Exp_Lbl_ExpRequest}
          </div>
        </div>
      )}
      <ViewItem label={msg().Exp_Lbl_RequestTitle}>{subject}</ViewItem>
      <ViewItem label={msg().Exp_Lbl_RequestNo}>{reportNo}</ViewItem>
      <ViewItem label={msg().Exp_Clbl_EstimatedAmount}>
        <p
          className={`${ROOT}__amount`}
        >{`${baseCurrencySymbol} ${formattedTotalAmount}`}</p>
      </ViewItem>
      <ViewItem label={msg().Exp_Lbl_RequestPurpose}>{purpose}</ViewItem>
    </>
  );
};

PreRequestArea.defaultProps = {
  className: '',
  withHeader: false,
};

export default PreRequestArea;
