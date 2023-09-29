import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IPresenter<
  TOutputData extends Interface.IOutputData = unknown,
  T extends Record<string, Function> = Record<string, Function>
> = {
  complete: (outputData: TOutputData) => void;
  error?: (error: unknown) => void;
  start?: () => void;
  finally?: () => void;
} & T;

export type IUseCaseInteractor<
  TServices,
  TPresenter extends IPresenter<TOutputData, Presenter>,
  TUseCase extends Interface.IUseCase<TInputData, TOutputData>,
  Presenter extends Record<string, Function> = Record<string, Function>,
  TInputData extends Interface.IInputData = Interface.IInputData,
  TOutputData extends Interface.IOutputData = Interface.IOutputData
> = (services: TServices) => (presenter: TPresenter) => TUseCase;
