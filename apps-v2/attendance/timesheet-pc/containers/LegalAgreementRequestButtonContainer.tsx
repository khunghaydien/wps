import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '../modules';

import RequestActions from './dialogs/LegalAgreementRequestDialogContainer/actions';

import LegalAgreementRequestButton from '../components/MainContent/Timesheet/LegalAgreementRequestButton';

import getRequestSummary from '@apps/attendance/domain/services/LegalAgreementRequestService/getRequestSummary';
import useAccessControl from '@attendance/timesheet-pc/hooks/useAccessControl';

const LegalAgreementRequestButtonContainer: React.FC = () => {
  const dispatch = useDispatch();

  const summaryLocked = useSelector(
    (state: State) => state.entities.timesheet.attSummary?.isLocked
  );

  const requests = useSelector(
    (state: State) => state.ui.legalAgreementRequest.list.requests
  );

  const disabled = useSelector(
    (state: State) => state.ui.legalAgreementRequest.page.loading
  );

  const workingType = useSelector(
    (state: State) => state.entities.timesheet.workingType
  );

  const allowed = useAccessControl({
    requireIfByEmployee: ['submitAttLegalAgreementRequestByEmployee'],
    requireIfByDelegate: ['submitAttLegalAgreementRequestByDelegate'],
  });

  const displayed = useMemo(() => {
    // 使用しない場合は無条件で表示しない
    if (!workingType.useLegalAgreement) {
      return false;
    }

    // 申請がある場合は表示する
    if (requests?.length) {
      return true;
    }

    // 月次勤務確定がされている場合は表示しない
    if (summaryLocked) {
      return false;
    }

    // それ以外はアクセス権限があるかどうか
    return allowed;
  }, [allowed, summaryLocked, requests?.length, workingType.useLegalAgreement]);

  const status = useMemo(() => getRequestSummary(requests)?.status, [requests]);

  const onClick = useCallback(() => {
    const requestActions = RequestActions(dispatch);
    requestActions.openRequest();
  }, [dispatch]);

  if (!displayed) {
    return null;
  }

  return (
    <LegalAgreementRequestButton
      status={status}
      disabled={disabled}
      onClick={onClick}
    />
  );
};

export default LegalAgreementRequestButtonContainer;
