import React from 'react';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';

import { ROOT } from './index';

import './index.scss';

const ListHeader = () => {
  return (
    <MultiColumnsGrid
      className={`${ROOT}__Grid`}
      sizeList={[2, 2, 2, 2, 2, 1, 1]}
    >
      {/* <span className={`${ROOT}__row_id`}>#</span> */}
      <span className={`${ROOT}__Employee`}>{msg().Psa_Lbl_Employee}</span>
      <span className={`${ROOT}__StartDate`}>{msg().Psa_Lbl_StartDate}</span>
      <span className={`${ROOT}__EndDate`}>{msg().Psa_Lbl_EndDate}</span>
      <span className={`${ROOT}__ListOfActions`}>
        {msg().Psa_Lbl_ListActions}
      </span>
      <span className={`${ROOT}__Options`}>{msg().Psa_Lbl_Option}</span>
      <span className={`${ROOT}__Value`}>{msg().Admin_Lbl_Value}</span>
      <span className={`${ROOT}__Action`}>{msg().Psa_Lbl_Action}</span>
    </MultiColumnsGrid>
  );
};

export default ListHeader;
