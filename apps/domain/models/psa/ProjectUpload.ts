import Api, { NAMESPACE_PREFIX } from '@apps/commons/api';

export const VALID_EXTENSIONS = ['csv'];

export const ALLOWED_MIME_TYPES = [...VALID_EXTENSIONS.map((x) => `.${x}`)];

export const MAX_FILE_SIZE = 3072000;

export const MAX_ERROR_LOG_LINE = 5;

const SOBJECT_TYPE = NAMESPACE_PREFIX + 'PsaProjectUpload__c';

const OPERATION = 'insert';

export type uploadCheckResponse = {
  allowUpload: boolean;
};

export type ProjectUploadResponse = {
  jobId: string;
};

export type ProcessedFileResponse = {
  file?: File;
  error?: string;
};

export type CsvFileResponse = {
  CsvContent?: string;
  error?: string;
};

export type ProjectUploadInfo = {
  jobId: string;
  allowUpload: boolean;
  uploadSuccess: boolean;
  errorLog: string;
};

export const initialProjectUploadInfo = {
  jobId: '',
  allowUpload: false,
  uploadSuccess: false,
  errorLog: '',
};

export const uploadProjectCheck = (
  projectId: string,
  psaGroupId: string
): Promise<uploadCheckResponse> => {
  return Api.invoke({
    path: '/psa/project/upload-check',
    param: { projectId, psaGroupId },
  }).then((response: { response: uploadCheckResponse }) => response);
};

export const processProject = (
  projectId: string,
  psaGroupId: string
): Promise<ProjectUploadResponse> => {
  return Api.invoke({
    path: '/psa/project/upload',
    param: { projectId, psaGroupId },
  }).then((response: { response: ProjectUploadResponse }) => response);
};

export const clearUpload = (
  projectId: string,
  ids: Array<string>
): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/upload-clear',
    param: { ids, projectId },
  }).then((response) => response);
};

export const uploadBulk = (file: File): Promise<any> => {
  const response = Api.bulkApi(SOBJECT_TYPE, OPERATION, file)
    .then((response: any) => response)
    .catch((err) => {
      const error = {
        errorCode: err.errorCode,
        message: err.message,
        stackTrace: null,
      };
      throw error;
    });

  return response;
};

export const uploadCsv = (csvContent: string): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/upload-csv',
    param: { csvContent },
  }).then((response) => response);
};

export const uploadStatus = (jobId: string, batchId: string): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/upload-status',
    param: { jobId, batchId },
  }).then((response) => response);
};
