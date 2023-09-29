import React from 'react';

import find from 'lodash/find';

import { CustomRequest } from '../../../../../../domain/models/exp/CustomRequest';

import DateUtil from '../../../../../utils/DateUtil';

import msg from '../../../../../languages';
import { OptionList } from '../../../../fields/CustomDropdown';
import Grid from '../../../../Grid';

const ROOT = 'ts-expenses-modal-custom-request__table';

export type TableProps = {
  onClickCustomRequest: (arg0: CustomRequest) => void;
};

type Props = TableProps & {
  customRequests: CustomRequest[];
  statusOptions: OptionList;
};

const dateFormatter = (props: { value: string }) =>
  DateUtil.dateFormat(props.value);

const CustomRequestTable = (props: Props) => {
  const handleClickRow = (id: string) => {
    const info = find(props.customRequests, { id }) || ({} as CustomRequest);
    props.onClickCustomRequest(info);
  };
  const statusFormatter = (data: { value: string }) => {
    const option = find(props.statusOptions, { value: data.value }) || {
      label: '',
    };
    return option.label;
  };

  return (
    <div className={ROOT}>
      <Grid
        data={props.customRequests}
        idKey="id"
        columns={[
          {
            name: msg().Exp_Lbl_Status,
            key: 'status',
            width: 110,
            formatter: statusFormatter,
          },
          {
            name: msg().Exp_Lbl_RequestType,
            key: 'recordType',
            width: 160,
          },
          {
            name: msg().Exp_Lbl_Title,
            key: 'title',
            width: 230,
          },
          {
            name: msg().Exp_Lbl_EmployeeName,
            key: 'employeeName',
            width: 180,
          },
          {
            name: msg().Exp_Lbl_RequestedDate,
            key: 'requestDate',
            width: 140,
            formatter: dateFormatter,
          },
        ]}
        selected={[]}
        browseId=""
        onClickRow={handleClickRow}
        onChangeRowSelection={() => {}}
        emptyMessage={msg().Cmn_Lbl_SuggestNoResult}
      />
    </div>
  );
};

export default CustomRequestTable;
