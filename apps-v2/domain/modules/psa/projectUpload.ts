import cloneDeep from 'lodash/cloneDeep';

import msg from '@apps/commons/languages';

import {
  clearUpload,
  initialProjectUploadInfo,
  ProcessedFileResponse,
  processProject,
  ProjectUploadInfo,
  uploadBulk,
  uploadCheckResponse,
  uploadProjectCheck,
} from '@apps/domain/models/psa/ProjectUpload';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';

import { processCsvFile } from '@apps/admin-pc/utils/ProjectUploadUtil';

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

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<ProjectUploadInfo> =>
      dispatch(initialize()),
  upload:
    (projectId: string, file: File) =>
    (dispatch: AppDispatch): void | any =>
      uploadProjectCheck(projectId).then(async (res: uploadCheckResponse) => {
        if (res.allowUpload) {
          dispatch(setAllowUpload(res.allowUpload));
          const ids = [];
          const errorLog = [];
          let allSuccess = true;

          // Pre process the file before uploading
          const processedResponse: ProcessedFileResponse = await processCsvFile(
            file,
            projectId
          );
          const hasProcessError = !!(await processedResponse.error);
          if (hasProcessError) {
            dispatch(setUploadError());
            dispatch(setUploadErrorLog(processedResponse.error));
          }

          // Start calling the bulk API if no process error
          if (!hasProcessError && processedResponse.file) {
            await uploadBulk(processedResponse.file)
              .then((response) => {
                for (let i = 0; i < response.length; i++) {
                  if (response[i].success) {
                    ids.push(response[i].id);
                  } else {
                    allSuccess = false;
                    errorLog.push(
                      decodeURIComponent(response[i].errors.join(','))
                    );
                  }
                }
                if (!allSuccess) {
                  dispatch(setUploadError());
                  dispatch(setUploadErrorLog(errorLog.join(',')));
                }
              })
              .catch((err) => {
                errorLog.push(err.message);
                allSuccess = false;
              });
          }

          // If all success, trigger the batch process
          // If not all success, clear the uploaded Ids
          if (allSuccess && !hasProcessError) {
            await processProject(projectId).then(() => {
              dispatch(setUploadSuccess());
            });
          }
          if (!allSuccess) {
            await clearUpload(projectId, ids).then(() => {
              dispatch(setUploadError());
              dispatch(setUploadErrorLog(errorLog.join(',')));
            });
          }
        } else {
          dispatch(setUploadError());
          dispatch(setUploadErrorLog(msg().Psa_Msg_ErrorUploadProjectBatch));
        }
      }),
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
