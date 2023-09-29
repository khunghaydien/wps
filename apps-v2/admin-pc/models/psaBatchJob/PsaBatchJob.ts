export enum AdditionalParamType {
  PARAM_INTEGER = 'Integer',
  PARAM_STRING = 'String',
  PARAM_DATE = 'Date',
  PARAM_BOOLEAN = 'Boolean',
}

export enum PsaBatchJobCategory {
  CATEGORY_PROJECT = 'PROJECT',
  CATEGORY_RESOURCE = 'RESOURCE',
  CATEGORY_OTHER = 'OTHER',
}

export type AdditionalParam = {
  paramName: string;
  paramType: AdditionalParamType;
  paramLabel: string;
  paramDefaultValue: string;
  paramMaxValue?: string;
  paramDescription?: string;
  paramRequired?: boolean;
};

export type GetBatchJobParam = {
  companyId: string;
};

export type BatchJob = {
  category: PsaBatchJobCategory;
  firstJobCode: string;
  batchJobName: string;
  batchJobDescription: string;
  lastStartAt: string;
  additionalParam?: Array<AdditionalParam>;
};

export type RunBatchJobParam = {
  companyId: string;
  firstJobCode: string;
  additionalParam?: AdditionalParam;
};
