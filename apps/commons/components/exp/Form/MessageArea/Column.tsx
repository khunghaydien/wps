import React from 'react';

import DateUtil from '../../../../utils/DateUtil';

import msg from '../../../../languages';

import './Column.scss';

const ROOT = 'ts-expenses__form-message-area-column';

export type MessageAreaColumn = {
  expTypeName?: string;
  fieldName?: string;
  message: string | any;
  recordDate?: string;
};

type Props = {
  idx: number;
  column: MessageAreaColumn;
};

const Column = ({ column, idx }: Props) => {
  const { recordDate, expTypeName, message, fieldName = '' } = column;
  const messageText = fieldName
    ? `${fieldName}:${msg()[message]}`
    : msg()[message];
  return (
    <tr key={idx} className={ROOT}>
      {recordDate && (
        <td className={`${ROOT}__record-date`}>
          {DateUtil.dateFormat(recordDate)}
        </td>
      )}
      {expTypeName && (
        <td className={`${ROOT}__exptype-name`}>{expTypeName}</td>
      )}
      <td className={`${ROOT}__message`}>{messageText}</td>
    </tr>
  );
};

export default Column;
