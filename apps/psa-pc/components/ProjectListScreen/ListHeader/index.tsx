import React from 'react';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import SortIcon from '@apps/commons/images/icons/sort.svg';
import msg from '@apps/commons/languages';

import './index.scss';

const ROOT = 'ts-psa__list-header';

const ListHeader = () => {
  const sortIcon = <SortIcon className={`${ROOT}__sort-icon`} />;

  return (
    <MultiColumnsGrid className={ROOT} sizeList={[2, 2, 1, 2, 2, 1, 1, 1]}>
      <span className={`${ROOT}__project-code`}>
        {msg().Psa_Lbl_ProjectCode} {sortIcon}
      </span>

      <span className={`${ROOT}__title`}>
        {msg().Psa_Lbl_ProjectTitle} {sortIcon}
      </span>

      <span className={`${ROOT}__client`}>
        {msg().Psa_Lbl_ProjectClient} {sortIcon}
      </span>

      <span className={`${ROOT}__department`}>
        {msg().Psa_Lbl_ProjectDepartment} {sortIcon}
      </span>

      <span className={`${ROOT}__manager`}>
        {msg().Psa_Lbl_ProjectManager} {sortIcon}
      </span>

      <span className={`${ROOT}__status`}>
        {msg().Com_Lbl_Status} {sortIcon}
      </span>

      <span className={`${ROOT}__start-date`}>
        {msg().Psa_Lbl_StartDate} {sortIcon}
      </span>

      <span className={`${ROOT}__end-date`}>
        {msg().Psa_Lbl_EndDate} {sortIcon}
      </span>
    </MultiColumnsGrid>
  );
};

export default ListHeader;
