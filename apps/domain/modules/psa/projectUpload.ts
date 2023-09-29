import cloneDeep from 'lodash/cloneDeep';

import msg from '@apps/commons/languages';
import { loadingEnd, loadingStart } from '@commons/actions/app';

import {
  clearUpload,
  CsvFileResponse,
  initialProjectUploadInfo,
  processProject,
  ProjectUploadInfo,
  uploadCheckResponse,
  uploadCsv,
  uploadProjectCheck,
  uploadStatus,
} from '@apps/domain/models/psa/ProjectUpload';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';

import { getCsvContent } from '@apps/admin-pc/utils/ProjectUploadUtil';

export const ACTIONS = {
  UPLOAD_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT_UPLOAD/UPLOAD_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT_UPLOAD/INIT_SUCCESS',
  UPLOAD_ERROR: 'MODULES/ENTITIES/PSA/PROJECT_UPLOAD/UPLOAD_ERROR',
  SET_ALLOW_UPLOAD: 'MODULES/ENTITIES/PSA/PROJECT_UPLOAD/SET_ALLOW_UPLOAD',
  SET_UPLOAD_ERROR_LOG:
    'MODULES/ENTITIES/PSA/PROJECT_UPLOAD/SET_UPLOAD_ERROR_LOG',
};

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

const setAllowUpload = (allowUpload: boolean) => ({
  type: ACTIONS.SET_ALLOW_UPLOAD,
  payload: allowUpload,
});
const setUploadSuccess = () => ({
  type: ACTIONS.UPLOAD_SUCCESS,
  payload: true,
});
const setUploadErrorLog = (errorLog: string) => ({
  type: ACTIONS.SET_UPLOAD_ERROR_LOG,
  payload: errorLog,
});
const setUploadError = () => ({
  type: ACTIONS.UPLOAD_ERROR,
  payload: false,
});

const delay = (n) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
};

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<ProjectUploadInfo> =>
      dispatch(initialize()),
  uploadSuccess: () => (dispatch: AppDispatch) => dispatch(setUploadSuccess()),
  upload:
    (projectId: string, psaGroupId: string, file: File) =>
    async (dispatch: AppDispatch): Promise<void> => {
      let continuable = true;
      await uploadProjectCheck(projectId, psaGroupId).then(
        async (res: uploadCheckResponse) => {
          if (!res.allowUpload) {
            continuable = false;
            dispatch(setUploadError());
            dispatch(setUploadErrorLog(msg().Psa_Msg_ErrorUploadProjectBatch));
          }
        }
      );
      if (!continuable) {
        return null;
      }
      dispatch(setAllowUpload(true));

      const errorLog = [];

      // Pre process the file before uploading
      const processedResponse: CsvFileResponse = await getCsvContent(
        file,
        projectId
      );
      const hasProcessError = !!(await processedResponse.error);
      if (hasProcessError) {
        continuable = false;
        dispatch(setUploadError());
        dispatch(setUploadErrorLog(processedResponse.error));
      }
      if (!continuable) {
        return null;
      }
      // Start calling the bulk API if no process error
      const uploadResponse = await uploadCsv(processedResponse.CsvContent)
        .then((response) => response)
        .catch((err) => {
          continuable = false;
          errorLog.push(err.message);
          dispatch(setUploadError());
          dispatch(setUploadErrorLog(errorLog.join(',')));
        });
      if (!continuable) {
        return null;
      }
      try {
        dispatch(loadingStart());

        for (let i = 0; i < 10; i++) {
          await delay(10);
          const res: any = await uploadStatus(
            uploadResponse.jobId,
            uploadResponse.batchId
          );
          if (res.status === 'Closed') {
            const ids = [];
            const errorLog = [];
            let allSuccess = true;
            for (let j = 0; j < res.batchResult.length; j++) {
              if (res.batchResult[j].success) {
                ids.push(res.batchResult[j].id);
              } else {
                allSuccess = false;
                errorLog.push(res.batchResult[j].error || '');
              }
            }
            if (!allSuccess) {
              clearUpload(projectId, ids).then(() => {
                dispatch(setUploadError());
                dispatch(setUploadErrorLog(errorLog.join(',')));
                dispatch(loadingEnd());
              });
            } else {
              processProject(projectId, psaGroupId).then(() => {
                dispatch(setUploadSuccess());
                dispatch(loadingEnd());
              });
            }
            break;
          }
        }
        dispatch(loadingEnd());
      } catch (err) {
        dispatch(loadingEnd());
      }
    },
};

const initialState = initialProjectUploadInfo;

type State = ProjectUploadInfo;

export default (state: State = initialState, action: any) => {
  const newState = cloneDeep(state);
  switch (action.type) {
    case ACTIONS.SET_ALLOW_UPLOAD:
      newState.allowUpload = action.payload;
      return newState;
    case ACTIONS.UPLOAD_SUCCESS:
    case ACTIONS.UPLOAD_ERROR:
      newState.uploadSuccess = action.payload;
      return newState;
    case ACTIONS.SET_UPLOAD_ERROR_LOG:
      newState.errorLog = action.payload;
      return newState;
    case ACTIONS.INIT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
