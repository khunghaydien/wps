import React from 'react';

import _ from 'lodash';

import msg from '../../../../../../../commons/languages';
import DateUtil from '../../../../../../../commons/utils/DateUtil';
import Dialog from '../../../../../molecules/commons/Dialog';

import { Record } from '../../../../../../../domain/models/exp/Record';

import Amount from '../../../../../atoms/Amount';

import './index.scss';

const ROOT = 'mobile-app-molecules-commons-dialog';

type Props = {
  values: Record;
  currencyDecimalPlace: number;
  currencySymbol: string;
  isShowDialog: boolean;
  onDialogLeftClick: () => void;
  onDialogRightClick: () => void;
  onDialogCloseClick: () => void;
};

export default (props: Props) => {
  const { values, isShowDialog } = props;

  if (!isShowDialog) {
    return null;
  }

  return (
    <Dialog
      title={msg().Exp_Lbl_ItemIsSaved}
      content={
        <div className={`${ROOT}__content-container`}>
          <p className={`${ROOT}__item`}>{msg().Exp_Clbl_Date}:</p>
          <p className={`${ROOT}__sub-item`}>
            {DateUtil.dateFormat(values.recordDate)}
          </p>
          <p className={`${ROOT}__item`}>{msg().Exp_Clbl_ExpenseType}:</p>
          <p className={`${ROOT}__sub-item`}>{values.items[0].expTypeName}</p>
          <p className={`${ROOT}__item`}>{msg().Exp_Lbl_Summary}:</p>
          <p className={`${ROOT}__sub-item`}>{values.items[0].remarks}</p>
          <Amount
            amount={values.items[0].amount}
            className={`${ROOT}__item`}
            decimalPlaces={props.currencyDecimalPlace}
            symbol={props.currencySymbol}
          />
        </div>
      }
      leftButtonLabel={msg().Appr_Lbl_Submit}
      rightButtonLabel={msg().Appr_Lbl_ContinueToRegister}
      onClickLeftButton={props.onDialogLeftClick}
      onClickRightButton={props.onDialogRightClick}
      onClickCloseButton={props.onDialogCloseClick}
    />
  );
};
