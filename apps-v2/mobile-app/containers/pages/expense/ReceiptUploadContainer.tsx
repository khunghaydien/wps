import React, { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';

import AppPermissionUtil from '../../../../commons/utils/AppPermissionUtil';

import { Base64FileList, getMetadata } from '@apps/domain/models/exp/Receipt';

import { State } from '../../../modules';
import { actions as fileMetadataActions } from '@mobile/modules/expense/entities/fileMetadata';

import {
  getBase64files,
  uploadReceipts,
} from '../../../action-dispatchers/expense/Receipt';

import UploadPage from '../../../components/pages/expense/Report/Upload';

const ReceiptUploadContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const useExpense = useSelector(
    (state: State) => state.userSetting.useExpense
  );
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const currencyId = useSelector(
    (state: State) => state.userSetting.currencyId
  );
  const useReceiptScan = useSelector(
    (state: State) => state.userSetting.useReceiptScan
  );

  const hasPermissionError = AppPermissionUtil.checkPermissionError(
    useExpense,
    employeeId,
    currencyId
  );

  const dispatchBase64files = (e: FormEvent<HTMLInputElement>) =>
    dispatch(getBase64files(e))
      // @ts-ignore
      .then((res: Base64FileList) => res);

  return (
    <Formik
      initialValues={{ files: [], rawFiles: [] }}
      onSubmit={(values, { setValues }) => {
        dispatch(uploadReceipts(values.files, useReceiptScan))
          // @ts-ignore
          .then((res) => {
            // save metadata for multi files
            values.rawFiles.forEach(async (raw, index) => {
              const { contentDocumentId } = res[index];
              const metadata = await getMetadata(raw);
              if (metadata) {
                dispatch(
                  fileMetadataActions.save({ ...metadata, contentDocumentId })
                );
              }
            });
            setValues({ files: [], rawFiles: [] });
          });
      }}
    >
      {(props) => (
        <UploadPage
          values={props.values}
          hasPermissionError={hasPermissionError}
          useReceiptScan={useReceiptScan}
          setFieldValue={props.setFieldValue}
          handleSubmit={props.handleSubmit}
          getBase64files={dispatchBase64files}
        />
      )}
    </Formik>
  );
};

export default ReceiptUploadContainer;
