import React, { useEffect, useRef, useState } from 'react';
import ReactTable from 'react-table';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { RECORD_DETAIL_COLUMN } from '../constants/keyMap';

import Button from '../../commons/components/buttons/Button';
import msg from '../../commons/languages';

import { field, sObjDetail } from '../models/ObjectDetail';

import { getEditableColumn, getReferenceColumn } from './RecordTable';

import 'react-table/react-table.css';
import './RecordDetailPage.scss';

const ROOT = 'db-tool-record-detail-page';

export type ObjRecord = Record<string, any>;

type Props = {
  objKey: string;
  record: ObjRecord;
  isEditMode: boolean;
  objDetail: sObjDetail;
  setMode: (arg0: boolean) => void;
  onClickSaveEdit: (arg0: { [key: string]: ObjRecord }) => void;
  updateRecord: (arg0: ObjRecord) => void;
  onClickCancel: () => void;

  /*
  this is false positive.
  This value is used by the component defined in the component.
   FIXME: However, in practice,
  it would be better to define this component on the outside and pass Props.
  */
  onClickDetailRecordId: (arg0: string, arg1: string) => void; // eslint-disable-line react/no-unused-prop-types
  onClickGoBack: (arg0: Record<string, any>, arg1: boolean) => void;
};

const getRecordData = (record: Record<string, any>, fields: Array<field>) => {
  const data = fields.map((x) => {
    const row = {} as ObjRecord;
    row.id = x.name;
    row.name = x.name;
    row.label = x.label;
    row.type = x.typeName;
    const value = record[x.name];
    if (typeof value === 'boolean') {
      row.value = value.toString();
    } else if (typeof value === 'object') {
      row.value = JSON.stringify(value);
    } else {
      row.value = value;
    }
    return row;
  });
  return data || [];
};

const VALUE_COLUMN = 'value';

const RecordDetailPage = (props: Props) => {
  const {
    objKey,
    record,
    isEditMode,
    objDetail,
    setMode,
    updateRecord,
    onClickSaveEdit,
    onClickGoBack,
  } = props;
  const objField = get(objDetail, 'fields', []);
  const [updatedRow, setUpdatedRow] = useState<Record<string, any>>({});
  const tableRef = useRef();

  useEffect(() => {
    if (!isEditMode) {
      setUpdatedRow({});
      setMode(false);
    }
  }, [isEditMode]);

  const recordData =
    (!isEmpty(record) && getRecordData(record, objField)) || [];

  const onClickUpdate = () => {
    setMode(true);
  };

  const onClickSave = () => {
    if (isEditMode && !isEmpty(updatedRow)) {
      onClickSaveEdit(updatedRow);
    }
  };

  const onClickCancel = () => {
    if (isEditMode) {
      if (!isEmpty(updatedRow)) {
        props.onClickCancel();
      } else {
        setMode(false);
      }
    }
  };

  const onEditCellKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const renderEditCell = (cellInfo) => {
    const rowIdx = cellInfo.index;
    const rowId = cellInfo.original.id;
    const value = recordData[rowIdx].value;
    return (
      <div
        suppressContentEditableWarning
        contentEditable={isEditMode}
        onBlur={(e) => {
          const datas = cloneDeep(record);
          if (e.target.textContent !== value) {
            datas[rowId] = e.target.textContent;
            const updateData = cloneDeep(updatedRow);
            updateData[rowId] = {
              type: recordData[rowIdx].type,
              value: e.target.textContent,
            };
            setUpdatedRow(updateData);
            updateRecord(datas);
          }
        }}
        onKeyPress={onEditCellKeyPress}
        onPaste={(e) => {
          e.preventDefault();
          const plainText = e.clipboardData.getData('text/plain');
          window.document.execCommand('insertText', false, plainText);
        }}
      >
        {value}
      </div>
    );
  };

  const renderNavigateCell = (cellInfo) => {
    const rowIdx = cellInfo.index;
    const columnId = cellInfo.column.id;
    const navigateId = recordData[rowIdx][columnId];
    return (
      navigateId && (
        <div
          className="navigatable-highlight"
          onClick={() => {
            props.onClickDetailRecordId(cellInfo.original.name, navigateId);
          }}
        >
          {navigateId}
        </div>
      )
    );
  };

  const renderCell = (column, cellInfo) => {
    if (column !== VALUE_COLUMN) {
      return recordData[cellInfo.index][cellInfo.column.id];
    } else if (!isEditMode) {
      if (getReferenceColumn(cellInfo.original.name, objField)) {
        return renderNavigateCell(cellInfo);
      } else {
        return recordData[cellInfo.index][cellInfo.column.id];
      }
    } else if (getEditableColumn(cellInfo.original.name)) {
      return renderEditCell(cellInfo);
    } else {
      return recordData[cellInfo.index][cellInfo.column.id];
    }
  };

  const cellFn = (state, rowInfo, column) => {
    const isValueColumn = column.id === VALUE_COLUMN;
    const isEditableHighlight =
      isEditMode && isValueColumn && getEditableColumn(rowInfo.original.name);
    const isModifiedHighlight =
      get(updatedRow, `${rowInfo.original.name}`, '') && isValueColumn;
    const cellStyle = classNames({
      'isEditable-highlight': isEditableHighlight,
      'isModified-highlight': isModifiedHighlight,
    });
    return { className: cellStyle };
  };

  return (
    <div className={ROOT}>
      <Button
        className={`${ROOT}-btn-back`}
        onClick={() => onClickGoBack(updatedRow, false)}
      >
        {msg().Com_Lbl_BackToMainPage}
      </Button>
      <section className={`${ROOT}-btn-row`}>
        <span className={`${ROOT}-object-key`}>{objKey}</span>
        {!isEditMode ? (
          <Button
            className={`${ROOT}-btn-update`}
            onClick={onClickUpdate}
            disabled={isEditMode}
          >
            {msg().Com_Btn_Edit}
          </Button>
        ) : (
          <Button
            className={`${ROOT}-btn-save`}
            onClick={onClickSave}
            disabled={isEmpty(updatedRow)}
          >
            {msg().Com_Btn_Save}
          </Button>
        )}
        <Button
          className={`${ROOT}-btn-cancel`}
          onClick={onClickCancel}
          disabled={!isEditMode}
        >
          {msg().Com_Btn_Cancel}
        </Button>
      </section>
      {!isEmpty(recordData) && (
        // @ts-ignore
        <ReactTable
          className={`${ROOT}-record-table`}
          ref={tableRef}
          data={recordData}
          columns={RECORD_DETAIL_COLUMN.map((x) => ({
            Header: x.charAt(0).toUpperCase() + x.substring(1),
            accessor: x,
            Cell: (cellInfo) => renderCell(x, cellInfo),
          }))}
          updatedRow={updatedRow}
          showPagination={false}
          pageSize={recordData.length}
          sortable={false}
          getTdProps={cellFn}
          minRows={0}
        />
      )}
    </div>
  );
};

export default RecordDetailPage;
