import UseCaseCollection from '@attendance/application/UseCaseCollection';
import { IUseCase as ISubmitFixDailyRequestWithClockOutUseCase } from '@attendance/domain/combinedUseCases/ISubmitFixDailyRequestWithClockOutUseCase';
import { IUseCase as IFixDailyRequestCancelApprovalUseCase } from '@attendance/domain/useCases/fixDailyRequest/ICancelApprovalUseCase';
import { IUseCase as IFixDailyRequestCancelSubmittedUseCase } from '@attendance/domain/useCases/fixDailyRequest/ICancelSubmittedUseCase';
import { IUseCase as ISubmitFixDailyRequestUseCase } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import { IUseCase as IStampTimePostUseCase } from '@attendance/domain/useCases/stampTime/IPostUseCase';

export type UseCases = {
  stampTime: IStampTimePostUseCase;
  submitFixDailyRequest: ISubmitFixDailyRequestUseCase;
  submitFixDailyRequestWithClockOut: ISubmitFixDailyRequestWithClockOutUseCase;
  cancelSubmittedFixDailyRequest: IFixDailyRequestCancelSubmittedUseCase;
  cancelApprovalFixDailyRequest: IFixDailyRequestCancelApprovalUseCase;
};

const service = UseCaseCollection<UseCases>(
  "MobileTimeStampPage's UseCase Service"
);

export default service;
