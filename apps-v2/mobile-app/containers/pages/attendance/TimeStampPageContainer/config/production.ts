/**
 * Container 配下で UseCase を作成するのは賛否両論あると思うが
 * Mobile では page = Container になっているのでここで展開することにする
 */
import { Store } from 'redux';

import DailyRecordRepository from '@attendance/repositories/DailyRecordRepository';
import DailyStampTimeRepository from '@attendance/repositories/DailyStampTimeRepository';
import FixDailyRequestRepository from '@attendance/repositories/FixDailyRequestRepository';

import createPresenters from '../presenters';
import UseCases from '../UseCases';
import {
  Permission,
  setPermission,
} from '@attendance/application/AccessControlService';
import submitFixDailyRequestWithClockOut from '@attendance/application/combinedUseCaseInteractors/SubmitFixDailyRequestWithClockOutUseCaseInteractor';
import { create as createUseCaseInteractor } from '@attendance/application/useCaseInteractors';
import cancelApprovalFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/CancelApprovalUseCaseInteractor';
import cancelSubmittedFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/CancelSubmittedUseCaseInteractor';
import submitFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/SubmitUseCaseInteractor';
import stampTimeInteractor from '@attendance/application/useCaseInteractors/stampTime/PostUseCaseInteractor';

export default ({
  store,
  permission,
}: {
  store: Store;
  permission: Permission;
}): void => {
  setPermission(permission);

  const Repositories = {
    DailyStampTimeRepository,
    DailyRecordRepository,
    FixDailyRequestRepository,
  };

  const presenters = createPresenters(store);

  const UseCaseInteractors = createUseCaseInteractor({
    stampTime: stampTimeInteractor(Repositories),
    submitFixDailyRequest: submitFixDailyRequest(Repositories),
    cancelSubmittedFixDailyRequest:
      cancelSubmittedFixDailyRequest(Repositories),
    cancelApprovalFixDailyRequest: cancelApprovalFixDailyRequest(Repositories),
  });

  const PrimitiveUseCaseMethods = {
    stampTime: UseCaseInteractors.stampTime(presenters.stampTime.post.normal),
    submitFixDailyRequest: UseCaseInteractors.submitFixDailyRequest(
      presenters.fixDailyRequest.submit
    ),
    cancelSubmittedFixDailyRequest:
      UseCaseInteractors.cancelSubmittedFixDailyRequest(
        presenters.fixDailyRequest.cancelSubmitted
      ),
    cancelApprovalFixDailyRequest:
      UseCaseInteractors.cancelApprovalFixDailyRequest(
        presenters.fixDailyRequest.cancelApproval
      ),
  };

  const CombinedUseCaseInteractors = createUseCaseInteractor({
    submitFixDailyRequestWithClockOut: submitFixDailyRequestWithClockOut({
      stampTime: UseCaseInteractors.stampTime(
        presenters.stampTime.post.noCompleteMessage
      ),
      submitFixDailyRequest: PrimitiveUseCaseMethods.submitFixDailyRequest,
    }),
  });

  UseCases.register({
    ...PrimitiveUseCaseMethods,
    submitFixDailyRequestWithClockOut:
      CombinedUseCaseInteractors.submitFixDailyRequestWithClockOut(
        presenters.combined.submitFixDailyRequestWithClockOut
      ),
  });
};
