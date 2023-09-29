import React, { useRef } from 'react';

import classNames from 'classnames';

import {
  BULK_EDIT_UPLOAD_LOADING_AREA,
  Record,
} from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';

import { GridAreaContainerType } from './GridArea';
import UploadArea from './UploadArea';

import './index.scss';

const ROOT = 'ts-expenses__form-records__bulk-edit';
const UPLOAD_CONTAINER_CLASS = `${ROOT}__upload-container`;
const HIDE_CLASS = `${ROOT}__area--hide`;

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  bulkRecordIdx: number;
  checkboxes: number[];
  errors: {
    records?: Record[];
  };
  gridAreaContainer: GridAreaContainerType;
  isExpenseRequest: boolean;
  isLoading: boolean;
  loadingAreas: string[];
  loadingHint: string;
  report: Report;
  touched: {
    records?: Record[];
  };
  onChangeCheckBox: (id: number) => void;
  onChangeCheckBoxes: (ids: number[]) => void;
  onChangeEditingExpReport: (
    field: string,
    value: boolean | string | Record,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
  onDropReceiptFiles: (files: File[]) => void;
  showErrorToast: (message: string) => void;
};

const BulkEdit = ({
  baseCurrencyDecimal,
  baseCurrencySymbol,
  bulkRecordIdx,
  checkboxes,
  errors,
  gridAreaContainer: GridAreaContainer,
  isExpenseRequest,
  isLoading,
  loadingAreas = [],
  loadingHint,
  onChangeCheckBox,
  onChangeCheckBoxes,
  onChangeEditingExpReport,
  onDropReceiptFiles,
  report,
  showErrorToast,
  touched,
}: Props) => {
  const gridAreaRef = useRef(null);
  const uploadAreaRef = useRef(null);
  const hasRecords = report.records.length > 0;
  const isUploadAreaLoading = loadingAreas.includes(
    BULK_EDIT_UPLOAD_LOADING_AREA
  );
  const uploadContainerClass = classNames(UPLOAD_CONTAINER_CLASS, {
    [HIDE_CLASS]: !isUploadAreaLoading && hasRecords,
  });

  const onDragToggle = () => {
    if (hasRecords) {
      gridAreaRef.current.classList.toggle(`${ROOT}__grid-area--blur`);
      uploadAreaRef.current.classList.toggle(HIDE_CLASS);
    }
  };

  return (
    <div
      className={ROOT}
      onDragEnter={onDragToggle}
      onDragLeave={onDragToggle}
      onDrop={onDragToggle}
      role="button"
    >
      <div ref={gridAreaRef}>
        <GridAreaContainer
          baseCurrencyDecimal={baseCurrencyDecimal}
          baseCurrencySymbol={baseCurrencySymbol}
          bulkRecordIdx={bulkRecordIdx}
          checkboxes={checkboxes}
          classRoot={ROOT}
          errors={errors}
          isLoading={isLoading}
          loadingAreas={loadingAreas}
          loadingHint={loadingHint}
          onChangeCheckBox={onChangeCheckBox}
          onChangeCheckBoxes={onChangeCheckBoxes}
          onChangeEditingExpReport={onChangeEditingExpReport}
          report={report}
          touched={touched}
        />
      </div>
      <div className={uploadContainerClass} ref={uploadAreaRef}>
        <UploadArea
          className={`${UPLOAD_CONTAINER_CLASS}-loading`}
          classRoot={ROOT}
          isExpenseRequest={isExpenseRequest}
          isLoading={isLoading}
          loadingAreas={loadingAreas}
          loadingHint={loadingHint}
          onDropReceiptFiles={onDropReceiptFiles}
          showErrorToast={showErrorToast}
        />
      </div>
    </div>
  );
};

export default BulkEdit;
