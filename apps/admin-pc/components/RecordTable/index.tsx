import * as React from 'react';

import classNames from 'classnames';

import Cell from './Cell';
import Header, { SortOrder } from './Header';
import Row from './Row';

import './index.scss';

const ROOT = 'admin-pc-record-table';

type Props<
  Record extends {
    [key: string]: any;
  }
> = Readonly<{
  className?: string;
  fields: {
    key: string;
    label: string;
    width?: string;
    disabledSort?: boolean;
  }[];
  records: Record[];
  sort: {
    field: string;
    order: SortOrder;
  };
  emptyMessage?: string;
  selectedRowIndex?: number;
  renderField?: (
    arg0: Record[keyof Record],
    arg1: string,
    arg2: Record
  ) => React.ReactNode | Record[keyof Record];
  onClickRow: (arg0: Record, arg1: number) => void;
  onClickHeaderCell: (arg0: string) => void;
}>;

const RecordTable = <
  Record extends {
    [key: string]: any;
  }
>({
  className,
  fields,
  records,
  sort,
  emptyMessage,
  selectedRowIndex,
  onClickHeaderCell,
  onClickRow,
  renderField,
}: Props<Record>) => (
  <div className={classNames(ROOT, className)}>
    <div className={`${ROOT}__header-container`}>
      <Header fields={fields} sort={sort} onClickCell={onClickHeaderCell} />
    </div>
    <div className={`${ROOT}__body-container`}>
      <div className={`${ROOT}__body`}>
        {records.length > 0 ? (
          records.map((record, idx) => (
            <Row
              className={`${ROOT}__row`}
              key={String(idx)}
              onClick={() => onClickRow(record, idx)}
              active={selectedRowIndex === idx}
            >
              {fields.map(({ key, width }) => (
                <Cell className={`${ROOT}__cell`} key={key} width={width}>
                  {renderField
                    ? renderField(record[key], key, record)
                    : record[key]}
                </Cell>
              ))}
            </Row>
          ))
        ) : (
          <div className={`${ROOT}__empty`}>{emptyMessage}</div>
        )}
      </div>
    </div>
  </div>
);

export default RecordTable;
