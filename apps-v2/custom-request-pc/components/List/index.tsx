import React, { useEffect, useMemo, useState } from 'react';

import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import DataGrid, {
  SORT,
  SortDirection,
} from '@apps/commons/components/exp/DatatGrid';
import FilterableHeaderCell from '@apps/commons/components/exp/DatatGrid/FilterableHeaderCell';
import FileActive from '@apps/commons/images/icons/file-active.svg';
import FileInactive from '@apps/commons/images/icons/file-inactive.svg';
import FileLink from '@apps/commons/images/icons/file-link.svg';
import Spinner from '@apps/core/elements/Spinner';
import { NAMESPACE_PREFIX } from '@commons/api';
import Currency from '@commons/components/Grid/Formatters/Currency';
import usePrevious from '@commons/hooks/usePrevious';
import DateUtil from '@commons/utils/DateUtil';

import {
  RECORD_ACCESS_FIELD_NAME,
  typeName as TYPE_NAME,
} from '@apps/domain/models/customRequest/consts';
import {
  ColumnConfig,
  CustomRequests,
  RecordTypes,
} from '@apps/domain/models/customRequest/types';

import EmptyList from './EmptyList';
import ListHeader from './ListHeader';

import './index.scss';

export type Props = {
  isLoading: boolean;
  recordTypeList: RecordTypes;
  selectedRecordTypeId: string;
  columnConfig: ColumnConfig;
  customRequestList: CustomRequests;
  selectedIndexes?: string[];
  currencySymbol: string;
  isShowClone: boolean;
  onClickNew: () => void;
  setCount?: (count: number) => void;
  onRowsSelected?: (ids: string[]) => void;
  onRowsDeselected?: (ids: string[]) => void;
  onSelectRecordType: (recordTypeId: string) => void;
  onClickRow: (recordTypeId: string) => void;
  onClickRefresh: () => void;
  onClickDelete: (idList: Array<string>) => void;
  onClickClone: (idList: Array<string>) => void;
};

const ROOT = 'ts-custom-request-list';
const STATUS_FIELD_NAME = NAMESPACE_PREFIX + 'Status__c';

const getColumnWidth = (size) => {
  return size > 10 ? 200 : undefined;
};

const FileIconFormatter = ({ value }: { value: boolean }) => {
  const FileIcon = value ? FileActive : FileInactive;
  return <FileIcon aria-hidden="true" />;
};

const CellFormatter = (
  typeName,
  currencySymbol,
  fractionDigits,
  picklistValues = [],
  field,
  data
) => {
  const { value } = data;
  switch (typeName) {
    case TYPE_NAME.BOOLEAN:
      return value.toString();
    case TYPE_NAME.CURRENCY:
      return (
        <Currency
          value={value}
          baseCurrencySymbol={currencySymbol || ''}
          baseCurrencyDecimal={fractionDigits}
        />
      );
    case TYPE_NAME.DATE:
      return DateUtil.formatYMD(value);
    case TYPE_NAME.DATETIME:
      return value && DateUtil.formatYMDhhmm(value);
    case TYPE_NAME.PICKLIST:
      if (field === STATUS_FIELD_NAME) {
        return value;
      }
      const option =
        picklistValues.find((option) => option.value === value) || {};
      return option.label || value;
    case TYPE_NAME.DOUBLE:
      return value && value.toLocaleString();
    default:
      return value;
  }
};

const RequestList = ({
  columnConfig,
  customRequestList: list,
  onClickRow,
  selectedIndexes,
  currencySymbol,
  onRowsSelected,
  onRowsDeselected,
  setCount,
}: Partial<Props>) => {
  const [data, setData] = useState(list);

  const prevList = usePrevious(list);
  useEffect(() => {
    if (!isEqual(prevList, list)) {
      setData(list);
    }
  }, [list]);

  const onGridSort = (sortColumn: string, sortDirection: SortDirection) => {
    const column = find(columnConfig, { key: sortColumn });
    const typeName = column ? column.typeName : '';
    const { DOUBLE, CURRENCY } = TYPE_NAME;
    const isNumberType = [DOUBLE, CURRENCY].includes(typeName);
    const toLower = (x) => (String(x) ? String(x).toLowerCase() : '');

    const stringComparer = (a, b) => {
      if (sortDirection === SORT.ASC) {
        return toLower(a[sortColumn]) > toLower(b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === SORT.DESC) {
        return toLower(a[sortColumn]) < toLower(b[sortColumn]) ? 1 : -1;
      }
    };

    const numberComparer = (a, b) => {
      if (sortDirection === SORT.ASC) {
        return a[sortColumn] - b[sortColumn];
      } else if (sortDirection === SORT.DESC) {
        return b[sortColumn] - a[sortColumn];
      }
    };

    if (sortDirection === SORT.NONE) {
      return;
    }

    const comaprer = isNumberType ? numberComparer : stringComparer;
    setData((prev) => [...prev].sort(comaprer));
  };

  const displayData = data.map((row, i) => {
    const labelMap = row.labelMap;
    const displayRow = {};
    // map display value for reference fields
    Object.keys(row).forEach((key) => {
      displayRow[key] = labelMap[key] || row[key];
    });
    return { ...displayRow, index: i + 1 };
  });

  const getColumns = useMemo(() => {
    const filteredColumn = columnConfig.filter(
      ({ field, readOnly }) => field !== RECORD_ACCESS_FIELD_NAME && !readOnly
    );
    return [
      {
        key: 'index',
        name: '#',
        width: 50,
        filterable: false,
        sortable: false,
      },
      {
        key: 'hasFile',
        name: <FileLink aria-hidden="true" />,
        width: 50,
        filterable: false,
        formatter: FileIconFormatter,
      },
    ]
      .concat(filteredColumn)
      .map((x) => ({
        filterable: true,
        filterRenderer: (props) => {
          return <FilterableHeaderCell {...props} debounce={true} />;
        },
        resizable: true,
        sortable: true,
        width: getColumnWidth(filteredColumn.length),
        formatter: CellFormatter.bind(
          null,
          (x as any).typeName,
          currencySymbol,
          (x as any).fractionDigits,
          (x as any).picklistValues,
          (x as any).field
        ),
        ...x,
      }));
  }, [columnConfig, currencySymbol]);

  const renderList = () =>
    isEmpty(list) ? (
      <EmptyList />
    ) : (
      <DataGrid
        rowHeight={40}
        columns={getColumns as any}
        data={displayData}
        getCellActions={() => {}}
        visibleRowNum={18}
        setCount={setCount}
        onGridSort={onGridSort}
        rowSelection={{
          showCheckbox: true,
          onRowsSelected: (rows) =>
            onRowsSelected(rows.map(({ rowIdx }) => rowIdx)),
          onRowsDeselected: (rows) =>
            onRowsDeselected(rows.map(({ rowIdx }) => rowIdx)),
          selectBy: {
            indexes: selectedIndexes,
          },
        }}
        onRowClick={(idx, row) => {
          if (idx > -1) onClickRow(row.Id);
        }}
      />
    );

  return <div className={ROOT}>{renderList()}</div>;
};

const CustomRequestList = (props: Props) => {
  const [selectedIndexes, setSelectedIndexes] = useState(new Set([]));
  const [count, setCount] = useState(0);

  const {
    isLoading,
    isShowClone,
    recordTypeList,
    selectedRecordTypeId,
    columnConfig,
    customRequestList,
    currencySymbol,
    onClickNew,
  } = props;

  useEffect(() => {
    setCount(customRequestList.length);
  }, [customRequestList]);

  const onRowsSelected = (ids: string[]) =>
    setSelectedIndexes((prev) => new Set([...prev, ...ids]));

  const onRowsDeselected = (ids: string[]) =>
    setSelectedIndexes(
      (prev) => new Set([...prev].filter((x) => !ids.includes(x)))
    );

  const selectedIds = Array.from(selectedIndexes).map(
    (idx) => customRequestList[idx].Id
  );

  const onClickDelete = () => {
    props.onClickDelete(selectedIds);
    setSelectedIndexes(new Set([]));
  };

  const onClickClone = () => {
    props.onClickClone(selectedIds);
    setSelectedIndexes(new Set([]));
  };

  const handleChangeRecordType = (id) => {
    setSelectedIndexes(new Set([]));
    props.onSelectRecordType(id);
  };

  return (
    <>
      <ListHeader
        recordTypeList={recordTypeList}
        selectedRecordTypeId={selectedRecordTypeId}
        onSelectRecordType={handleChangeRecordType}
        onClickRefresh={props.onClickRefresh}
        onClickDelete={onClickDelete}
        onClickClone={onClickClone}
        isShowClone={isShowClone}
        selectedIdList={selectedIds}
        rowCount={count}
        onClickNew={onClickNew}
      />

      {isLoading ? (
        <div className={`${ROOT}__spinner`}>
          <Spinner />
        </div>
      ) : (
        <RequestList
          customRequestList={customRequestList}
          columnConfig={columnConfig}
          currencySymbol={currencySymbol}
          onClickRow={props.onClickRow}
          onRowsSelected={onRowsSelected}
          onRowsDeselected={onRowsDeselected}
          selectedIndexes={Array.from(selectedIndexes)}
          setCount={setCount}
        />
      )}
    </>
  );
};

export default CustomRequestList;
