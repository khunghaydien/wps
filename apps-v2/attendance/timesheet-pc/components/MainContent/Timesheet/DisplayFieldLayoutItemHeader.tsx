import React from 'react';

import classNames from 'classnames';

import {
  DailyRecordDisplayFieldLayoutItem,
  LAYOUT_ITEM_TYPE,
} from '@apps/attendance/domain/models/DailyRecordDisplayFieldLayout';

import './DisplayFieldLayoutItemHeader.scss';

type Props = {
  layoutHead: DailyRecordDisplayFieldLayoutItem[];
};

const ROOT =
  'timesheet-pc-main-content-timesheet-display-field-layout-item-header';

export const ItemHeader: React.FC<{
  item: DailyRecordDisplayFieldLayoutItem;
}> = ({ item }) => {
  const { editable, type, viewType, name } = item;
  const baseClassName = `${ROOT}__header ${ROOT}__${type}`;

  if (type === LAYOUT_ITEM_TYPE.STRING && item.pickList) {
    return (
      <div className={`${ROOT}__header ${ROOT}__string--dropdown`} title={name}>
        {name}
      </div>
    );
  }
  return (
    <div
      title={name}
      className={classNames(baseClassName, {
        [`${baseClassName}--editable`]: editable,
        [`${baseClassName}--${viewType}`]: viewType,
      })}
    >
      {name}
    </div>
  );
};

const DisplayFieldLayoutItemHeader: React.FC<Props> = ({ layoutHead }) => {
  return (
    <tr className={ROOT}>
      {layoutHead?.map((item) => (
        <th key={item.id}>
          <ItemHeader item={item} />
        </th>
      ))}
    </tr>
  );
};

export default DisplayFieldLayoutItemHeader;
