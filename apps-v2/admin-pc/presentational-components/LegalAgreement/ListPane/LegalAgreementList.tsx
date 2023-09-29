import React from 'react';

import msg from '@apps/commons/languages';

import { LegalAgreementListItem } from '../../../models/legal-agreement/LegalAgreement';

import DataGrid from '@apps/admin-pc/components/DataGrid';

export type Props = {
  itemList: LegalAgreementListItem[];
  selectedCode: string;
  onClickRow: (
    arg0: number,
    arg1: {
      [key: string]: any;
    }
  ) => void;
};

const convertItemListToRows = (itemList) => {
  return itemList.map((item, index) => ({ ...item, originIndex: index }));
};

const LegalAgreementList: React.FC<Props> = ({
  itemList,
  selectedCode,
  onClickRow,
}) => {
  return (
    <div className=" data-grid">
      <DataGrid
        columns={[
          {
            key: 'code',
            name: msg().Admin_Lbl_Code,
            sortable: true,
            resizable: true,
            filterable: true,
          },
          {
            key: 'name',
            name: msg().Admin_Lbl_Name,
            sortable: true,
            resizable: true,
            filterable: true,
          },
        ]}
        rows={convertItemListToRows(itemList).map((cal) => ({
          ...cal,
          isSelected: cal.id === selectedCode,
        }))}
        onRowClick={onClickRow}
      />
    </div>
  );
};

export default LegalAgreementList;
