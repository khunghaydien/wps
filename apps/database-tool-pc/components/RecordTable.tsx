import React, { useEffect, useMemo, useRef, useState } from 'react';
// flowlint untyped-type-import:off
import ReactTable from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { ID_FIELD, NEW_ADD_ROW_PREFIX } from '../constants/keyMap';
import { MAX_RECORDS_NUMBER, RecordTableMode } from '../constants/recordTable';

import Button from '../../commons/components/buttons/Button';
import Pagination from '../../commons/components/Pagination';
import msg from '../../commons/languages';

import { field, sObjDetail } from '../models/ObjectDetail';

import { State as RecordState } from '../modules/entities/objRecord';

import 'react-table/react-table.css';
import './RecordTable.scss';

const ROOT = 'db-tool-record-table';

type Props = {
  recordOrg: RecordState;
  objDetail: sObjDetail;
  records: Array<Record<string, any>>;
  currentPage: number;
  isDeletedIncluded: boolean;
  listHeaderColumns: Array<string>;
  mode: number;
  resetCheckbox: boolean;
  setMode: (arg0: number) => void;
  onClickDeleteRecord: (arg0: Array<string>) => void;
  onClickUndeleteRecord: (arg0: Array<string>) => void;
  onChangeCurrentPage: (arg0: number, arg1: number) => void;
  onClickSaveEdit: (arg0: Array<Record<string, any>>) => void;
  onClickSaveAdd: (arg0: Array<Record<string, any>>) => void;
  updateRecord: (arg0: Array<Record<string, any>>) => void;
  onClickCancel: () => void;
  setCheckboxList: () => void;

  /*
  this is false positive.
  This value is used by the component defined in the component.
   FIXME: However, in practice,
  it would be better to define this component on the outside and pass Props.
  */
  onClickDetailRecordId: (arg0: string, arg1: string) => void; // eslint-disable-line react/no-unused-prop-types
  onChangePageSize: (arg0: number) => void;
};

const getRecordsData = (
  records: Array<Record<string, any>>,
  fieldList: Array<string>
) => {
  const data = records.map((x) => {
    const row = { id: x.Id };
    fieldList.forEach((c) => {
      if (typeof x[c] === 'boolean') {
        row[c] = x[c].toString();
      } else if (typeof x[c] === 'object') {
        row[c] = JSON.stringify(x[c]);
      } else if (c === ID_FIELD && x[c].includes(NEW_ADD_ROW_PREFIX)) {
        // don't display temporary generated Id
        row[c] = '';
      } else {
        row[c] = x[c];
      }
    });
    return row;
  });
  return data;
};

// generate tmp Id for new added row
const generateRandomId = () =>
  NEW_ADD_ROW_PREFIX.concat(Math.random().toString(36).substr(2, 9));

// Get Editable Columns - name field and fields end with __c,
// except custom relationship query contians __r. Exp: expenseType__r.expenseGroup__c
export const getEditableColumn = (fieldKey: string) => {
  const postfix = fieldKey.endsWith('__c') && !fieldKey.includes('__r');
  return fieldKey === 'Name' || postfix;
};

export const getReferenceColumn = (fieldKey: string, fields: Array<field>) => {
  const column = find(fields, { name: fieldKey });
  return get(column, 'typeName') === 'REFERENCE' || fieldKey === 'Id';
};

const SelectTable = selectTableHOC(ReactTable);
type State = {
  selectAll: boolean;
  selection: Array<string>;
};

type RTCprops = {
  keyField: string;
  isEditMode: boolean;
  isAddMode: boolean;
  isDeletedIncluded: boolean;
  updatedRow: Record<string, any>;
  onRowSelect: (arg0: Array<string | Record<string, any>>) => void;
  originalData: Record<string, any>;
  className: string;
  data: Array<Record<string, any>>;
  columns: Array<Record<string, any>>;
  pageSize: number;
  showPageSizeOptions: boolean;
  showPagination: boolean;
};
class ReactTableWithCheckbox extends React.Component<RTCprops, State> {
  checkboxTable: any;
  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      selection: [],
    };
  }

  resetSelectState = () => {
    this.setState({ selectAll: false, selection: [] });
  };

  toggleSelection = (key) => {
    this.setState((prevState) => {
      const prevSelection = [...prevState.selection];
      let selection = [];
      const keyIndex = prevSelection.indexOf(key);
      if (keyIndex >= 0) {
        selection = prevSelection.filter((item, idx) => idx !== keyIndex);
      } else {
        selection = prevSelection.concat([key]);
      }
      this.props.onRowSelect(selection);
      return { selection };
    });
  };

  toggleAll = () => {
    const { keyField } = this.props;
    this.setState((prevState) => {
      const selectAll = !prevState.selectAll;
      const selection = [];

      if (selectAll) {
        const wrappedInstance = this.checkboxTable.getWrappedInstance();
        const currentRecords = wrappedInstance.getResolvedState().sortedData;
        currentRecords.forEach((item) => {
          selection.push(`select-${item._original[keyField]}`);
        });
      }
      this.props.onRowSelect(selection);
      return { selectAll, selection };
    });
  };

  isSelected = (key) => {
    return this.state.selection.includes(`select-${key}`);
  };

  rowFn = (state, rowInfo) => {
    if (!rowInfo) {
      return {};
    }
    const { selection } = this.state;

    const isDeleted =
      rowInfo.row.IsDeleted === 'true' && this.props.isDeletedIncluded;
    const isSelected =
      !isDeleted && selection.includes(`select-${rowInfo.row.Id}`);
    const rowStyle = classNames({
      'isDeleted-highlight': isDeleted,
      'isSelected-highlight': isSelected,
    });
    return {
      className: rowStyle,
    };
  };

  cellFn = (state, rowInfo, column) => {
    if (!rowInfo) {
      return {};
    } else {
      const tmpValue = get(
        this.props.updatedRow,
        `${rowInfo.original.id}.${column.id}`,
        ''
      );
      const isModified = column.id !== 'Id' && !isEmpty(tmpValue);
      const isDeletedRow = rowInfo.row.IsDeleted === 'true';
      const isEditable =
        getEditableColumn(column.id) && this.props.isEditMode && !isDeletedRow;
      const isAddedRow =
        this.props.isAddMode && !rowInfo.row.Id && getEditableColumn(column.id);
      const cellStyle = classNames({
        'isEditable-highlight': isEditable,
        'isModified-highlight': isModified,
        'addedRow-isEditable-highlight': isAddedRow,
      });
      return { className: cellStyle };
    }
  };

  render() {
    return (
      <SelectTable
        {...this.props}
        ref={(r) => {
          this.checkboxTable = r;
        }}
        toggleSelection={this.toggleSelection}
        selectAll={this.state.selectAll}
        selectType="checkbox"
        toggleAll={this.toggleAll}
        isSelected={this.isSelected}
        getTrProps={this.rowFn}
        getTdProps={this.cellFn}
      />
    );
  }
}

const RecordTable = (props: Props) => {
  const {
    recordOrg,
    records,
    currentPage,
    isDeletedIncluded,
    listHeaderColumns,
    mode,
    setMode,
    resetCheckbox,
    objDetail,
    onChangeCurrentPage,
    onClickDeleteRecord,
    onClickUndeleteRecord,
    updateRecord,
    onClickSaveEdit,
    onClickSaveAdd,
    setCheckboxList,
  } = props;
  const { count } = recordOrg;
  // @ts-ignore
  const { fields } = objDetail || [];
  const [selectedRow, setSelectedRow] = useState<Array<string>>([]);
  const [updatedRow, setUpdatedRow] = useState<Record<string, any>>({});
  const [displayRowSize, setDisplayRowSize] =
    useState<number>(MAX_RECORDS_NUMBER);
  const tableRef = useRef();

  const isEditMode = mode === RecordTableMode.edit;
  const isAddMode = mode === RecordTableMode.insert;
  const isReadOnly = mode === RecordTableMode.readOnly;

  useEffect(() => {
    if (isReadOnly) {
      setUpdatedRow({});
    }
  }, [mode]);

  useEffect(() => {
    if (resetCheckbox) {
      setSelectedRow([]);
      (tableRef as any).current.resetSelectState();
      setCheckboxList();
    }
  }, [resetCheckbox]);

  const recordData =
    (!isEmpty(records) && getRecordsData(records, listHeaderColumns)) || [];

  const onClickDelete = () => {
    const selected = selectedRow.map((item) => item.split('select-')[1]);
    onClickDeleteRecord(selected);
  };

  const onClickUndelete = () => {
    const selected = selectedRow.map((item) => item.split('select-')[1]);
    onClickUndeleteRecord(selected);
  };

  const onClickAdd = () => {
    setMode(RecordTableMode.insert);
    const currentRecords = cloneDeep(records);
    const tmpUniqueId = generateRandomId();
    currentRecords.unshift({ Id: tmpUniqueId });
    updateRecord(currentRecords);
  };

  const onClickUpdate = () => {
    setMode(RecordTableMode.edit);
  };

  const onClickSave = () => {
    if (isEditMode && !isEmpty(updatedRow)) {
      onClickSaveEdit(Object.values(updatedRow));
    } else if (isAddMode) {
      const addedRow = Object.values(updatedRow).map((obj) => {
        const addedObj = { ...obj };
        delete addedObj.Id;
        return addedObj;
      });
      onClickSaveAdd(addedRow);
    }
  };

  const onClickCancel = () => {
    if (!isReadOnly) {
      if (!isEmpty(updatedRow) || isAddMode) {
        props.onClickCancel();
      } else {
        setMode(RecordTableMode.readOnly);
      }
    }
  };

  const onRowSelect = (selected: Array<string>) => {
    setSelectedRow(selected);
  };

  const onEditCellKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const onChangePageSize = (num: number) => {
    setDisplayRowSize(num);
    props.onChangePageSize(num);
  };

  const renderEditCell = (cellInfo) => {
    const isAddedRowCell =
      isAddMode &&
      get(records, `${cellInfo.index}.Id`).includes(NEW_ADD_ROW_PREFIX);
    const rowIdx = cellInfo.index;
    const rowId = cellInfo.original.id;
    const columnId = cellInfo.column.id;
    let value = records[rowIdx][columnId];
    if (typeof value === 'boolean') value = String(value);
    return (
      <div
        suppressContentEditableWarning
        contentEditable={isEditMode || isAddedRowCell}
        onBlur={(e) => {
          const datas = cloneDeep(records);
          if (e.target.textContent !== cellInfo.value) {
            datas[rowIdx][columnId] = e.target.textContent;
            const updateData = { ...updatedRow };
            const updateRow = updateData[rowId];
            if (updateRow) {
              updateRow[columnId] = e.target.textContent;
            } else {
              updateData[rowId] = {
                Id: rowId,
                [columnId]: e.target.textContent,
              };
            }
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
    const navigateId = records[rowIdx][columnId];
    return (
      navigateId && (
        <div
          className="navigatable-highlight"
          onClick={() => {
            props.onClickDetailRecordId(columnId, navigateId);
          }}
        >
          {navigateId}
        </div>
      )
    );
  };

  const getColumnWidth = (rows, accessor, headerText) => {
    const maxWidth = 400;
    const magicSpacing = 9;
    const cellLength = Math.max(
      ...rows.map((row) => (`${row[accessor]}` || '').length),
      headerText.length
    );
    return Math.min(maxWidth, cellLength * magicSpacing);
  };

  const renderCell = (column, cellInfo) => {
    if (isReadOnly) {
      if (getReferenceColumn(column, fields)) {
        return renderNavigateCell(cellInfo);
      } else {
        return cellInfo.original[column];
      }
    } else if (getEditableColumn(column)) {
      return renderEditCell(cellInfo);
    } else {
      return cellInfo.original[column];
    }
  };

  let pageSize = displayRowSize;
  if (records.length < displayRowSize && records.length > 0) {
    pageSize = records.length;
  }
  if (records.length === 0) {
    pageSize = 3;
  }

  return (
    <div className={`${ROOT}`}>
      <section>
        <Button
          className={`${ROOT}-btn-add`}
          onClick={onClickAdd}
          disabled={isEditMode}
        >
          {msg().Com_Btn_Add}
        </Button>
        <Button
          className={`${ROOT}-btn-update`}
          onClick={onClickUpdate}
          disabled={!isReadOnly || count === 0}
        >
          {msg().Com_Btn_Edit}
        </Button>
        <Button
          className={`${ROOT}-btn-save`}
          onClick={onClickSave}
          disabled={isEmpty(updatedRow)}
        >
          {msg().Com_Btn_Save}
        </Button>
        <Button
          className={`${ROOT}-btn-cancel`}
          onClick={onClickCancel}
          disabled={isReadOnly}
        >
          {msg().Com_Btn_Cancel}
        </Button>
        <Button
          className={`${ROOT}-btn-delete`}
          onClick={onClickDelete}
          disabled={isEmpty(selectedRow) || isEditMode}
        >
          {msg().Com_Btn_Delete}
        </Button>
        <Button
          className={`${ROOT}-btn-undelete`}
          onClick={onClickUndelete}
          disabled={isEmpty(selectedRow) || isEditMode}
        >
          {msg().Com_Btn_Undelete}
        </Button>
        {!!count && (
          <Pagination
            className={`${ROOT}__pager`}
            currentPage={currentPage}
            totalNum={count}
            displayNum={4}
            pageSize={[40, 80, 120, count]}
            onClickPagerLink={(num) => onChangeCurrentPage(num, displayRowSize)}
            maxPageNum={Math.ceil(count / displayRowSize)}
            havePagerInfo
            onChangePageSize={onChangePageSize}
          />
        )}
      </section>
      {useMemo(
        () =>
          listHeaderColumns && (
            <ReactTableWithCheckbox
              className={records.length === 0 && 'noRecord'}
              ref={tableRef}
              data={recordData}
              columns={listHeaderColumns.map((x) => ({
                Header: x,
                accessor: x,
                width: getColumnWidth(recordData, x, x),
                Cell: (cellInfo) => renderCell(x, cellInfo),
              }))}
              keyField="id"
              isEditMode={isEditMode}
              isAddMode={isAddMode}
              isDeletedIncluded={isDeletedIncluded}
              onRowSelect={onRowSelect}
              updatedRow={updatedRow}
              originalData={recordOrg.records}
              pageSize={pageSize}
              showPageSizeOptions={false}
              showPagination={false}
            />
          ),
        [records, listHeaderColumns, mode, isDeletedIncluded, displayRowSize]
      )}
    </div>
  );
};

export default RecordTable;
