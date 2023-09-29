import * as React from 'react';

import classnames from 'classnames';

import IconDown from '../../../commons/images/icons/down.svg';
import IconUp from '../../../commons/images/icons/up.svg';

import Cell from './Cell';
import Row from './Row';

import './Header.scss';

const ROOT = 'admin-pc-record-table-header';

export type SortOrder = 'ASC' | 'DESC';

const HeaderCell = ({
  label,
  width,
  sortOrder,
  disabledSort,
  onClick,
}: Readonly<{
  label: string;
  width?: string;
  sortOrder: SortOrder | null;
  disabledSort?: boolean;
  onClick: () => void;
}>) => (
  <Cell
    className={classnames(`${ROOT}__cell`)}
    onClick={disabledSort ? undefined : onClick}
    role="button"
    tabIndex={0}
    width={width}
  >
    <div
      className={classnames(`${ROOT}__cell-container`, {
        asc: sortOrder === 'ASC',
        desc: sortOrder === 'DESC',
      })}
    >
      <div className={`${ROOT}__label`}>{label}</div>
      {!disabledSort && (
        <div className={`${ROOT}__icon`}>
          <div className={`${ROOT}__icon-container`}>
            <div className={classnames(`${ROOT}__icon-wrapper`, `icon-up`)}>
              <IconUp />
            </div>
            <div className={classnames(`${ROOT}__icon-wrapper`, 'icon-down')}>
              <IconDown />
            </div>
          </div>
        </div>
      )}
    </div>
  </Cell>
);

type Props = Readonly<{
  className?: string;
  fields: {
    key: string;
    label: string;
    width?: string;
    disabledSort?: boolean;
  }[];
  sort: {
    field: string;
    order: SortOrder;
  };
  onClickCell: (arg0: string) => void;
}>;

const Header = ({ className, fields, sort, onClickCell }: Props) => (
  <Row className={classnames(ROOT, className)}>
    {fields.map(({ key, label, width, disabledSort }) => (
      <HeaderCell
        key={key}
        label={label}
        width={width}
        disabledSort={disabledSort}
        sortOrder={key === sort.field ? sort.order : null}
        onClick={() => onClickCell(key)}
      />
    ))}
  </Row>
);

export default Header;
