import { Store } from 'redux';

import { State } from '@attendance/timesheet-pc/modules';
import * as selectors from '@attendance/timesheet-pc/modules/selectors';

import actions from './actions';

import { IOutputData as IFetchListUseCaseOutputData } from '@attendance/domain/useCases/legalAgreementRequest/IFetchListUseCase';
import Events from '@attendance/timesheet-pc/events';
import UseCases from '@attendance/timesheet-pc/UseCases';

export default (store: Store): (() => void) => {
  let updated = false;
  const update = () => {
    updated = true;
  };

  const reload = async () => {
    const state = store.getState() as State;
    const targetDate = state.entities.timesheet.ownerInfos?.at(-1)?.endDate;
    const employeeId = selectors.employeeId(state) || null;
    UseCases().fetchListLegalAgreementRequest({
      employeeId,
      targetDate,
    });
    UseCases().fetchOvertimeLegalAgreement({
      employeeId,
      targetDate,
    });
    update();
  };

  const setDetail = async (result: IFetchListUseCaseOutputData) => {
    const state = store.getState() as State;
    const targetId = state.ui.legalAgreementRequest.editing.id;
    const selectedRequest = result?.requestList?.requests?.find(
      (item) => item?.id === targetId
    );
    if (selectedRequest) {
      actions(store.dispatch).showRequestDetailPane(selectedRequest);
    }
  };

  const unsubscribers = [];
  unsubscribers.push(
    UseCases().submitLegalAgreementRequest.subscribe(update),
    UseCases().reapplyLegalAgreementRequest.subscribe(update),
    UseCases().cancelRequestLegalAgreementRequest.subscribe(reload),
    UseCases().cancelApprovalLegalAgreementRequest.subscribe(reload),
    UseCases().removeLegalAgreementRequest.subscribe((result) => {
      if (result) {
        reload();
      }
    }),
    UseCases().fetchListLegalAgreementRequest.subscribe(setDetail)
  );

  return () => {
    unsubscribers.forEach((f) => f());
    // 開いて何もせずに閉じたときに勤務表読み込みが走るのを抑止している
    if (updated) {
      Events.updatedDailyRecord.publish();
    }
  };
};
