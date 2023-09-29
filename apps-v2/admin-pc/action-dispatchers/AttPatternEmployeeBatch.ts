import { bindActionCreators, Dispatch } from 'redux';

import csv from 'csv-parser';
// WORKAROUND: Can't execute module building with webpack on Edge.
// I don't know why, csv-stringify for es6 (from 'csv-stringify') can't build with webpack for Edge.
// It occurs error on Edge that the following:
//     SCRIPT1028: Expected identifier, string or number
// So as workaround, I use it for es5.
import csvStringify from 'csv-stringify/lib/es5';
import FileReaderStream from 'filereader-stream';
import isNil from 'lodash/isNil';
import moment from 'moment';

import {
  catchApiError,
  catchBusinessError,
  withLoading,
} from '../../commons/actions/app';
import msg from '../../commons/languages';

import Repository, {
  BatchResult,
  EMPLOYEE_PATTERN_RESULT_HEADERS,
  EmployeePattern,
  EmployeePatternResultHeader,
} from '@attendance/repositories/AttPatternEmployeeBatchRepository';

import { actions as batchResultListActions } from '../modules/attPatternEmployeeBatch/entities/batchResultList';
import { actions as employeePatternListActions } from '../modules/attPatternEmployeeBatch/entities/employeePatternList';
import { actions as detailPaneActions } from '../modules/attPatternEmployeeBatch/ui/detailPane';
import { showDetailPane } from '../modules/base/detail-pane/ui';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

const MAX_ROWS_OF_FILES = 5001; // NOTE it includes header row.

export const dropAttPatternEmployeeBatchFiles =
  (file: File) => (dispatch: Dispatch<any>) => {
    const detailPane = bindActionCreators(detailPaneActions, dispatch);
    const employeePatternList = bindActionCreators(
      employeePatternListActions,
      dispatch
    );
    const app = bindActionCreators({ catchBusinessError }, dispatch);

    // @ts-ignore
    detailPane.dropFiles([file]);
    employeePatternList.clear();
    dispatch(
      withLoading(
        () =>
          new Promise<void>((resolve) => {
            let totalDataRowCount = 0;

            const headers = [
              'employeeCode',
              'targetDate',
              'patternCode',
              'dayType',
              'fixContractType',
            ] as Array<keyof EmployeePattern>;

            new FileReaderStream(file)
              .pipe(csv([]))
              .on('data', (data: Record<string, unknown>) => {
                if (totalDataRowCount >= 1) {
                  // ヘッダーに指定した以上の列があると
                  // { '0': value, ... } というデータを返却してくるので
                  // csv(headers) は使用せずに自力で加工する
                  // csv() とすると一行目を勝手にヘッダーと認識してしまうので
                  // csv([]) としておく
                  const $data = headers.reduce((obj, key, idx) => {
                    if (idx in data) {
                      // @ts-ignore
                      obj[key] = data[idx];
                    }
                    return obj;
                  }, {} as EmployeePattern);
                  // WORKAROUND: Skip CSV header.
                  //
                  // csv-parser provides `skipLines` option to skip any lines from the beginning of the file.
                  // However, `skipLines` does not work with `headers` option.
                  // This is a bug and it has been already reported on Github.
                  // See https://github.com/mafintosh/csv-parser/issues/110
                  // The bug has been not fixed yet when the code was written, so as workaround,
                  // avoid adding first row.
                  employeePatternList.add($data);
                }

                totalDataRowCount += 1;
              })
              .on('error', (error: Error) => {
                employeePatternList.error();
                app.catchBusinessError(
                  error.name,
                  msg().Admin_Lbl_CsvFormatError,
                  msg().Admin_Lbl_CsvFormatErrorSolution,
                  {
                    isContinuable: true,
                  }
                );

                resolve();
              })
              .on('end', () => {
                if (totalDataRowCount <= 0) {
                  employeePatternList.error();
                  app.catchBusinessError(
                    '',
                    msg().Admin_Lbl_CsvEmptyError,
                    msg().Admin_Lbl_CsvEmptyErrorSolution,
                    {
                      isContinuable: true,
                    }
                  );
                }
                if (totalDataRowCount > MAX_ROWS_OF_FILES) {
                  employeePatternList.error();
                  app.catchBusinessError(
                    '',
                    msg().Admin_Lbl_CsvRowsLimitExceeded,
                    msg().Admin_Lbl_CsvRowsLimitExceededSolution,
                    { isContinuable: true }
                  );
                }

                resolve();
              });
          })
      )
    );
  };

export const deleteFiles = () => (dispatch: Dispatch<any>) => {
  const detailPane = bindActionCreators(detailPaneActions, dispatch);
  const employeePatternList = bindActionCreators(
    employeePatternListActions,
    dispatch
  );

  detailPane.update('files', []);
  employeePatternList.clear();
};

export const openNewDetailPane = () => (dispatch: Dispatch<any>) => {
  const detailPane = bindActionCreators(detailPaneActions, dispatch);
  const base = bindActionCreators({ showDetailPane }, dispatch);

  detailPane.clear();
  detailPane.update('isNew', true);
  base.showDetailPane(true);
};

export const openDownloadDetailPane =
  (batchResult: BatchResult) => (dispatch: Dispatch<any>) => {
    const detailPane = bindActionCreators(detailPaneActions, dispatch);
    const base = bindActionCreators({ showDetailPane }, dispatch);

    detailPane.update('isNew', false);
    detailPane.update('id', batchResult.id);
    detailPane.update('comment', batchResult.comment);
    detailPane.update('actor', batchResult.actorName);
    detailPane.update('actedAt', batchResult.importDateTime);
    detailPane.update('status', batchResult.status);
    detailPane.update('count', batchResult.count);
    detailPane.update('successCount', batchResult.successCount);
    detailPane.update('failureCount', batchResult.failureCount);
    base.showDetailPane(true);
  };
export const listBatchResults =
  (companyId: string, showLoading = true) =>
  (dispatch: AppDispatch): Promise<any> => {
    const app = bindActionCreators({ catchApiError }, dispatch);
    const batchResultList = bindActionCreators(
      batchResultListActions,
      dispatch
    );

    if (showLoading) {
      return dispatch(withLoading(() => Repository.search(companyId)))
        .then((records: BatchResult[]) =>
          batchResultList.searchSuccess(records)
        )
        .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
    } else {
      return Repository.search(companyId)
        .then((records: BatchResult[]) =>
          batchResultList.searchSuccess(records)
        )
        .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
    }
  };

export const refreshListBatchResult =
  (companyId: string, id: string) => (dispatch: AppDispatch) => {
    const app = bindActionCreators({ catchApiError }, dispatch);
    const batchResultList = bindActionCreators(
      batchResultListActions,
      dispatch
    );
    const detailPane = bindActionCreators(detailPaneActions, dispatch);

    return dispatch(withLoading(() => Repository.search(companyId)))
      .then((records: BatchResult[]) => {
        batchResultList.searchSuccess(records);

        const currentDisplayRecord = records.find((e) => e.id === id);
        detailPane.update('comment', currentDisplayRecord.comment);
        detailPane.update('actor', currentDisplayRecord.actorName);
        detailPane.update('actedAt', currentDisplayRecord.importDateTime);
        detailPane.update('status', currentDisplayRecord.status);
        detailPane.update('count', currentDisplayRecord.count);
        detailPane.update('successCount', currentDisplayRecord.successCount);
        detailPane.update('failureCount', currentDisplayRecord.failureCount);
      })
      .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
  };

export const executeBatch =
  (companyId: string, comment: string, patterns: EmployeePattern[]) =>
  (dispatch: AppDispatch): Promise<any> => {
    const app = bindActionCreators({ catchApiError }, dispatch);
    const base = bindActionCreators({ showDetailPane }, dispatch);

    return dispatch(
      withLoading(() =>
        Repository.create({
          companyId,
          comment,
          records: patterns,
        })
      )
    )
      .then(() => {
        base.showDetailPane(false);
        dispatch(listBatchResults(companyId));
      })
      .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
  };

const generateFilenameForAttPatternEmployeeFetchResult = (id: string) =>
  `att-pattern-employee-result_${id}_${moment().format('YYYY-MM-DD_x')}.csv`;

export const downloadFile = (id: string) => (dispatch: Dispatch<any>) => {
  const app = bindActionCreators({ withLoading, catchApiError }, dispatch);
  const headerRow: Record<EmployeePatternResultHeader, string> = {
    employeeCode:
      msg().Admin_Lbl_AttPatternEmployeeBatchFetchResultHeaderEmployeeCode,
    targetDate:
      msg().Admin_Lbl_AttPatternEmployeeBatchFetchResultHeaderTargetDate,
    patternCode:
      msg().Admin_Lbl_AttPatternEmployeeBatchFetchResultHeaderPatternCode,
    dayType: msg().Admin_Lbl_AttPatternEmployeeBatchFetchResultHeaderDayType,
    fixContractType:
      msg().Admin_Lbl_AttPatternEmployeeBatchFetchResultHeaderFixContractType,
    status: msg().Admin_Lbl_AttPatternEmployeeBatchFetchResultHeaderStatus,
    errorDetail:
      msg().Admin_Lbl_AttPatternEmployeeBatchFetchResultHeaderErrorDetail,
  };

  return app.withLoading(() =>
    Repository.fetch(id)
      .then(
        (result) =>
          new Promise((resolve, reject) => {
            csvStringify(
              [headerRow, ...result],
              {
                header: false,
                columns: EMPLOYEE_PATTERN_RESULT_HEADERS,
              },
              (err, content) => {
                if (isNil(err)) {
                  resolve(content);
                } else {
                  reject(err);
                }
              }
            );
          })
      )
      .then((content: ArrayBuffer) => {
        // This sourse block that made csv file is temploral for use only here.
        // If you want to use other, move to such as created new util object.
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        const blob = new Blob([bom, content], { type: 'text/csv' });
        const filename = generateFilenameForAttPatternEmployeeFetchResult(id);

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
        // Safari does not correspond.
      })
      .catch((err: Error) => {
        app.catchApiError(err, { isContinuable: true });
        throw err;
      })
  );
};
