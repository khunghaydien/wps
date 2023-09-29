import { bindActionCreators } from 'redux';

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
} from '@commons/actions/app';
import msg from '@commons/languages';

import Repository, {
  TIME_RECORD_ITEM_IMPORT_HEADER,
  TIME_RECORD_ITEM_IMPORT_RESULT_HEADER,
  TimeRecordItemImportRecord,
  TimeRecordItemImportResult,
  TimeRecordItemImportResultDetail,
} from '@apps/repositories/time-tracking/TimeRecordItemImportRepository';

import { showDetailPane } from '../../modules/base/detail-pane/ui';
import { actions as importResultListActions } from '../../modules/timeRecordItemImport/entities/importResultList';
import { actions as detailPaneActions } from '../../modules/timeRecordItemImport/ui/detailPane';
import { actions as timeRecordItemImportListActions } from '../../modules/timeRecordItemImport/ui/timeRecordItemImportList';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';

const MAX_ROWS_OF_FILES = 5001; // NOTE it includes header row.

export const dropFile = (file: File) => (dispatch: AppDispatch) => {
  const detailPane = bindActionCreators(detailPaneActions, dispatch);
  const timeRecordItemImportList = bindActionCreators(
    timeRecordItemImportListActions,
    dispatch
  );
  const app = bindActionCreators({ catchBusinessError }, dispatch);

  // @ts-ignore
  detailPane.dropFiles([file]);
  timeRecordItemImportList.clear();
  dispatch(
    withLoading(
      () =>
        new Promise<void>((resolve) => {
          let totalDataRowCount = 0;

          new FileReaderStream(file)
            .pipe(
              csv({
                strict: true,
                headers: TIME_RECORD_ITEM_IMPORT_HEADER,
              })
            )
            .on('data', (data: TimeRecordItemImportRecord) => {
              if (totalDataRowCount >= 1) {
                // WORKAROUND: Skip CSV header.
                //
                // csv-parser provides `skipLines` option to skip any lines from the beginning of the file.
                // However, `skipLines` does not work with `headers` option.
                // This is a bug and it has been already reported on Github.
                // See https://github.com/mafintosh/csv-parser/issues/110
                // The bug has been not fixed yet when the code was written, so as workaround,
                // avoid adding first row.
                timeRecordItemImportList.add(data);
              }
              totalDataRowCount += 1;
            })
            .on('error', (error: Error) => {
              timeRecordItemImportList.error();
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
                timeRecordItemImportList.error();
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
                timeRecordItemImportList.error();
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

export const deleteFile = () => (dispatch: AppDispatch) => {
  const detailPane = bindActionCreators(detailPaneActions, dispatch);
  const timeRecordItemImportList = bindActionCreators(
    timeRecordItemImportListActions,
    dispatch
  );

  detailPane.update('files', []);
  timeRecordItemImportList.clear();
};

export const openNewDetailPane = () => (dispatch: AppDispatch) => {
  const detailPane = bindActionCreators(detailPaneActions, dispatch);
  const base = bindActionCreators({ showDetailPane }, dispatch);

  detailPane.clear();
  detailPane.update('isNew', true);
  base.showDetailPane(true);
};

export const openDownloadDetailPane =
  (batchResult: TimeRecordItemImportResult) => (dispatch: AppDispatch) => {
    const detailPane = bindActionCreators(detailPaneActions, dispatch);
    const base = bindActionCreators({ showDetailPane }, dispatch);

    detailPane.update('isNew', false);
    detailPane.update('id', batchResult.id);
    detailPane.update('actor', batchResult.actorName);
    detailPane.update('actedAt', batchResult.importDateTime);
    detailPane.update('status', batchResult.status);
    detailPane.update('count', batchResult.count);
    detailPane.update('successCount', batchResult.successCount);
    detailPane.update('failureCount', batchResult.failureCount);
    base.showDetailPane(true);
  };

export const listImportResults =
  (companyId: string, showLoading = true) =>
  (dispatch: AppDispatch): Promise<any> => {
    const app = bindActionCreators({ catchApiError }, dispatch);
    const importResultList = bindActionCreators(
      importResultListActions,
      dispatch
    );

    if (showLoading) {
      return dispatch(withLoading(() => Repository.listResult(companyId)))
        .then((records: TimeRecordItemImportResult[]) =>
          importResultList.listSuccess(records)
        )
        .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
    } else {
      return Repository.listResult(companyId)
        .then((records: TimeRecordItemImportResult[]) =>
          importResultList.listSuccess(records)
        )
        .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
    }
  };

export const executeImport =
  (companyId: string, patterns: TimeRecordItemImportRecord[]) =>
  (dispatch: AppDispatch): Promise<any> => {
    const app = bindActionCreators({ catchApiError }, dispatch);
    const base = bindActionCreators({ showDetailPane }, dispatch);

    return dispatch(
      withLoading(() =>
        Repository.executeImport({
          companyId,
          records: patterns,
        })
      )
    )
      .then(() => {
        base.showDetailPane(false);
        dispatch(listImportResults(companyId));
      })
      .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
  };

const generateFilenameForFetchResult = (id: string) =>
  `time-record-item-import-result_${id}_${moment().format('YYYY-MM-DD_x')}.csv`;

export const downloadFile = (id: string) => (dispatch: AppDispatch) => {
  const app = bindActionCreators({ withLoading, catchApiError }, dispatch);
  const headerRow: Record<keyof TimeRecordItemImportResultDetail, string> = {
    employeeCode: msg().Admin_Lbl_TimeRecordItemImportResultHeaderEmployeeCode,
    recordDate: msg().Admin_Lbl_TimeRecordItemImportResultHeaderRecordDate,
    jobCode: msg().Admin_Lbl_TimeRecordItemImportResultHeaderJobCode,
    workCategoryCode:
      msg().Admin_Lbl_TimeRecordItemImportResultHeaderWorkCategoryCode,
    taskTime: msg().Admin_Lbl_TimeRecordItemImportResultHeaderTaskTime,
    status: msg().Admin_Lbl_TimeRecordItemImportResultHeaderStatus,
    errorDetail: msg().Admin_Lbl_TimeRecordItemImportResultHeaderErrorDetail,
  };

  return app.withLoading(() =>
    Repository.fetchResult(id)
      .then(
        (result) =>
          new Promise((resolve, reject) => {
            csvStringify(
              [headerRow, ...result],
              {
                header: false,
                columns: TIME_RECORD_ITEM_IMPORT_RESULT_HEADER,
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
        // This source block that made csv file is temporal for use only here.
        // If you want to use other, move to such as created new util object.
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        const blob = new Blob([bom, content], { type: 'text/csv' });
        const filename = generateFilenameForFetchResult(id);

        if (window.navigator.msSaveBlob) {
          // For IE and Ege
          window.navigator.msSaveBlob(blob, filename);
        } else {
          // For other
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.download = filename;
          a.href = url;
          a.target = '_blank';
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

export const refresh =
  (companyId: string, id: string) => (dispatch: AppDispatch) => {
    const app = bindActionCreators({ catchApiError }, dispatch);
    const importResultList = bindActionCreators(
      importResultListActions,
      dispatch
    );
    const detailPane = bindActionCreators(detailPaneActions, dispatch);

    return dispatch(withLoading(() => Repository.listResult(companyId)))
      .then((records: TimeRecordItemImportResult[]) => {
        importResultList.listSuccess(records);
        const currentDisplayRecord = records.find((e) => e.id === id);
        detailPane.update('isNew', false);
        detailPane.update('id', currentDisplayRecord.id);
        detailPane.update('actor', currentDisplayRecord.actorName);
        detailPane.update('actedAt', currentDisplayRecord.importDateTime);
        detailPane.update('status', currentDisplayRecord.status);
        detailPane.update('count', currentDisplayRecord.count);
        detailPane.update('successCount', currentDisplayRecord.successCount);
        detailPane.update('failureCount', currentDisplayRecord.failureCount);
      })

      .catch((err: Error) => app.catchApiError(err, { isContinuable: true }));
  };
