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
  SAVE_SUCCESS: 'MODULES/EXPENSE/ENTITIES/FILE_METADATA/SAVE_SUCCESS',
  SAVE_SUCCESS_LIST: 'MODULES/EXPENSE/ENTITIES/FILE_METADATA/SAVE_SUCCESS_LIST',
  FETCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/FILE_METADATA/FETCH_SUCCESS',
};

const saveSuccess = (metadata: FileMetadata) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: metadata,
});

const saveSuccessList = (metadatas: Array<FileMetadata>) => ({
  type: ACTIONS.SAVE_SUCCESS_LIST,
  payload: metadatas,
});

const fetchSuccess = (metadataList: FileMetadata[]) => ({
  type: ACTIONS.FETCH_SUCCESS,
  payload: metadataList,
});

export const actions = {
  save:
    (metadata: FileMetadata) =>
    (dispatch: Dispatch<any>): void => {
      saveMetadata(metadata)
        .then((res) => dispatch(saveSuccess({ ...metadata, ...res })))
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  saveList:
    (metadatas: Array<FileMetadata>) =>
    (dispatch: Dispatch<any>): void => {
      saveMetadataList(metadatas)
        .then((res) => {
          if (res && res.records && res.records.length === metadatas.length)
            dispatch(
              saveSuccessList(
                res.records.map((resInfo, i) => ({
                  ...metadatas[i],
                  ...resInfo,
                }))
              )
            );
        })
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
    case ACTIONS.SAVE_SUCCESS_LIST:
      const newMetadatas = action.payload;
      const stateCopy = cloneDeep(state);
      newMetadatas.forEach((newMetadata) => {
        const metadataIdx = state.findIndex(
          ({ contentDocumentId }) =>
            contentDocumentId === newMetadata.contentDocumentId
        );
        if (metadataIdx > -1) {
          stateCopy[metadataIdx] = newMetadata;
        } else {
          stateCopy.push(newMetadata);
        }
      });
      return stateCopy;
    case ACTIONS.FETCH_SUCCESS:
      return [...state, ...action.payload];
    default:
      return state;
  }
}) as Reducer<FileMetadata[], any>;
