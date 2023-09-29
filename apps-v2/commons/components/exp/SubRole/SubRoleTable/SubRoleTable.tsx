import React from 'react';

import classNames from 'classnames';
import { isEqual } from 'lodash';

import CheckIcon from '../../../../../core/assets/icons/check.svg';

import { SubRoleOption } from '../subRoleOptionCreator';

import './SubRoleTable.scss';

const ROOT = 'ts-expenses-switch-subrole-table';

type Props = {
  rows: Array<SubRoleOption>;
  // eslint-disable-next-line react/require-default-props
  selectedId?: string;
  onSelectRole: (id: string, item: SubRoleOption) => void;
};
const SubRoleTable = (props: Props): React.ReactElement => {
  const { rows, selectedId, onSelectRole } = props;

  const renderRows = () => {
    const items = rows || [];
    const renderRows = items.map((item) => {
      return (
        <TableRow
          key={item.value}
          label={item.label}
          value={item.value}
          selected={isEqual(item.value, selectedId)}
          onClick={
            item.disabled ? undefined : () => onSelectRole(item.value, item)
          }
          disabled={item.disabled}
        />
      );
    });
    return renderRows;
  };

  return <div className={ROOT}>{renderRows()}</div>;
};

const TableRow = ({
  label,
  value,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  value: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <div
      className={classNames({
        [`${ROOT}-row-container`]: true,
        [`${ROOT}-row-container-disabled`]: disabled,
      })}
      key={value}
      onClick={onClick}
    >
      {selected && !disabled && (
        <div className={`${ROOT}-row-container-selected-container`}>
          <CheckIcon />
        </div>
      )}
      <div
        className={classNames({
          [`${ROOT}-row-container-label-container`]: true,
          [`${ROOT}-row-container-label-container-selected`]:
            selected && !disabled,
        })}
      >
        {label}
      </div>
    </div>
  );
};

export default SubRoleTable;
