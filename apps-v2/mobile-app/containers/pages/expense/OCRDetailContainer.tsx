import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import { RECORD_TYPE } from '@apps/domain/models/exp/Record';

import { State } from '../../../modules';
import { actions as ocrDetailActions } from '../../../modules/expense/ui/ocrDetail';
import { actions as selectedOCRReceiptAction } from '../../../modules/expense/ui/selectedOCRReceipt';

import Component from '@mobile/components/pages/expense/Receipt/OCRDetailConfirm';

const DialogContainer = (ownProps) => {
  const baseCurrencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const useImageQualityCheck = useSelector(
    (state: State) => state.userSetting.useImageQualityCheck
  );

  const selectedOCRReceipt = useSelector(
    (state: State) => state.expense.ui.selectedOCRReceipt
  );

  const reportId = useSelector(
    (state: State) => state.expense.entities.report.reportId
  );

  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          setOCRDetail: ocrDetailActions.set,
          resetOCRDetail: ocrDetailActions.reset,
          resetSelectedReceipt: selectedOCRReceiptAction.clear,
        },
        dispatch
      ),
    [dispatch]
  );

  const onClickApplyBtn = () => {
    const target = reportId ? 'report' : 'record';
    const path = `/expense/expense-type/list/${RECORD_TYPE.General}`;
    pushHistoryWithPrePage(ownProps.history, path, { target });
  };

  const onClickBackBtn = () => {
    Actions.resetOCRDetail();
    Actions.resetSelectedReceipt();
    goBack(ownProps.history);
  };

  return (
    <Component
      onClickApplyBtn={onClickApplyBtn}
      onClickBackBtn={onClickBackBtn}
      setOCRDetail={Actions.setOCRDetail}
      selectedOCRReceipt={selectedOCRReceipt}
      useImageQualityCheck={useImageQualityCheck}
      baseCurrencyDecimal={baseCurrencyDecimal}
    />
  );
};

export default DialogContainer;
