export type IInputData<T = unknown> = T;

export type IOutputData<T = unknown> = T;

export type IUseCase<
  TInputData extends IInputData = IInputData,
  TOutputData extends IOutputData = IOutputData
> = (inputData: TInputData) => Promise<TOutputData>;
