import csvStringify from 'csv-stringify/lib/es5';
import { flatten } from 'lodash';
import isNil from 'lodash/isNil';

import { MAX_RECORDS_NUMBER } from '../constants/recordTable';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import { getObjRecords } from '../models/ObjectRecord';

import { AppDispatch } from '../modules/AppThunk';

// eslint-disable-next-line import/prefer-default-export
export const downloadFile =
  (
    objName: string,
    recordNum: number,
    isDeletedIncluded: boolean,
    fields: Array<string>,
    searchCondition?: string,
    sortCondition?: string
  ) =>
  (dispatch: AppDispatch): Promise<any> => {
    const promiseNum = recordNum / MAX_RECORDS_NUMBER;
    const promiseSet = [];
    for (let i = 0; i < promiseNum; i++) {
      const promise = getObjRecords(
        objName,
        fields,
        i * MAX_RECORDS_NUMBER,
        isDeletedIncluded,
        searchCondition,
        sortCondition
      );
      promiseSet.push(promise);
    }
    dispatch(loadingStart());

    return Promise.all(promiseSet)
      .then((result) => {
        const records = result.map((list) => list.records);

        return new Promise((resolve, reject) => {
          csvStringify(
            flatten(records),
            {
              header: true,
              columns: fields,
              cast: { boolean: (value) => value.toString() },
            },
            (err, content) => {
              if (isNil(err)) {
                resolve(content);
              } else {
                reject(err);
              }
            }
          );
        });
      })
      .then((content: ArrayBufferView) => {
        dispatch(loadingEnd());
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        const blob = new Blob([bom, content], {
          type: 'text/csv',
        });
        const filename = objName;

        if (window.navigator.msSaveBlob) {
          // For IE and Ege
          window.navigator.msSaveBlob(blob, filename);
        } else {
          // For other
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.download = filename;
          a.href = url;
          a.target = '_brank';
          a.click();
        }
      })
      .catch((err: Error) => {
        dispatch(loadingEnd());
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };
