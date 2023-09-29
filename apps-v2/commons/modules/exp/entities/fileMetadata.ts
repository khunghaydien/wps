import { Dispatch, Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';

import { catchApiError } from '@commons/actions/app';

import {
  FileMetadata,
  listMetadata,
  saveMetadata,
  saveMetadataList,
} from '@apps/domain/models/exp/Receipt';

export const ACTIONS = {
  SAVE_SUCCESS: 'COMMONS/EXP/ENTITIES/FILE_METADATA/SAVE_SUCCESS',
  SAVE_SUCCESS_LIST: 'COMMONS/EXP/ENTITIES/FILE_METADATA/SAVE_SUCCESS_LIST',
  FETCH_SUCCESS: 'COMMONS/EXP/ENTITIES/FILE_METADATA/FETCH_SUCCESS',
};

const saveSuccess = (metadata: FileMetadata) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: metadata,
});

const saveSuccessList = (metadataList: FileMetadata[]) => ({
  type: ACTIONS.SAVE_SUCCESS_LIST,
  payload: metadataList,
});

const fetchSuccess = (metadataList: FileMetadata[]) => ({
  type: ACTIONS.FETCH_SUCCESS,
  payload: metadataList,
});

export const actions = {
  save:
    (metadata: FileMetadata) =>
    (
      dispatch: Dispatch<any>
    ): Promise<void | { payload: FileMetadata; type: string }> => {
      return saveMetadata(metadata)
        .then((res) =>
          dispatch(
            saveSuccess({
              ...metadata,
              ...res,
            })
          )
        )
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  saveList:
    (metadataList: FileMetadata[]) =>
    (
      dispatch: Dispatch
    ): Promise<void | { payload: FileMetadata[]; type: string }> => {
      return saveMetadataList(metadataList)
        .then((res) =>
          dispatch(
            saveSuccessList({
              ...metadataList,
              ...res,
            })
          )
        )
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  fetch:
    (contentDocumentIds: string[]) =>
    (dispatch: Dispatch<any>): void => {
      listMetadata(contentDocumentIds)
        .then((res) => dispatch(fetchSuccess(res)))
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
};

const initialState: FileMetadata[] = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SAVE_SUCCESS:
      const newMetadata = action.payload;
      const metadataIdx = state.findIndex(
        ({ contentDocumentId }) =>
          contentDocumentId === newMetadata.contentDocumentId
      );
      if (metadataIdx > -1) {
        const stateCopy = cloneDeep(state);
        stateCopy[metadataIdx] = newMetadata;
        return stateCopy;
      } else {
        return [...state, newMetadata];
      }
    case ACTIONS.FETCH_SUCCESS:
      return [...state, ...action.payload];
    default:
      return state;
  }
}) as Reducer<FileMetadata[], any>;
