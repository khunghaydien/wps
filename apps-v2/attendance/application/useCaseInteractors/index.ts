/* eslint-disable @typescript-eslint/ban-types */
import reduce from 'lodash/reduce';

import * as IUseCaseInteractor from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import * as IUseCase from '@attendance/domain/useCases/IUseCase';

type UseCaseCreator = (arg: unknown) => (arg: unknown) => unknown;

type WrappedUseCaseCreators<T extends Record<string, UseCaseCreator>> = {
  [P in keyof T]: (
    arg:
      | Parameters<T[P]>[0]
      | ((inputData: Parameters<ReturnType<T[P]>>[0]) => Parameters<T[P]>[0])
  ) => ReturnType<T[P]>;
};

export const create = <
  TUseCaseInteractors extends Record<string, UseCaseCreator>
>(
  records: TUseCaseInteractors
) => wrapAll(records);

export const wrapAll = <T extends Record<string, UseCaseCreator>>(records: T) =>
  reduce(
    records,
    (obj, record, key) => {
      obj[key] = wrap(
        record as unknown as ReturnType<
          IUseCaseInteractor.IUseCaseInteractor<
            unknown,
            IUseCaseInteractor.IPresenter,
            IUseCase.IUseCase
          >
        >
      );
      return obj;
    },
    {}
  ) as WrappedUseCaseCreators<T>;

export const wrap =
  <
    TUseCaseInteractor extends (presenter: TPresenter) => TUseCase,
    TOutputData extends IUseCase.IOutputData = IUseCase.IOutputData,
    TInputData extends IUseCase.IInputData = IUseCase.IInputData,
    Presenter extends Record<string, Function> = Record<string, Function>,
    TPresenter extends IUseCaseInteractor.IPresenter<
      TOutputData,
      Presenter
    > = IUseCaseInteractor.IPresenter<TOutputData, Presenter>,
    TUseCase extends IUseCase.IUseCase<
      TInputData,
      TOutputData
    > = IUseCase.IUseCase<TInputData, TOutputData>
  >(
    creator: TUseCaseInteractor
  ) =>
  (presenterCreator: TPresenter | ((inputData: TInputData) => TPresenter)) =>
  async (inputData: TInputData): Promise<TOutputData> => {
    const presenter =
      typeof presenterCreator === 'function'
        ? presenterCreator(inputData)
        : presenterCreator;
    const useCase = creator(presenter);
    try {
      if (presenter.start) {
        presenter.start();
      }
      const outputData = await useCase(inputData);
      presenter.complete(outputData);
      return outputData;
    } catch (e) {
      if (presenter.error) {
        presenter.error(e);
      }
      throw e;
    } finally {
      if (presenter.finally) {
        presenter.finally();
      }
    }
  };
