import React from 'react';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import SortIcon from '@apps/commons/images/icons/sort.svg';
import msg from '@apps/commons/languages';

import './index.scss';

const ROOT = 'ts-resource__list-header';

const ListHeader = () => {
  const sortIcon = <SortIcon className={`${ROOT}__sort-icon`} />;

  return (
    <MultiColumnsGrid
      className={ROOT}
      sizeList={[1, 1, 1, 1, 2, 1, 2, 1, 1, 1]}
    >
      <span className={`${ROOT}__request-code`}>
        {msg().Psa_Lbl_RequestCode} {sortIcon}
      </span>

      <span className={`${ROOT}__project-code`}>
        {msg().Psa_Lbl_ProjectCode} {sortIcon}
      </span>

      <span className={`${ROOT}__title`}>
        {msg().Psa_Lbl_ProjectTitle} {sortIcon}
      </span>

      <span className={`${ROOT}__client`}>
        {msg().Psa_Lbl_ProjectClient} {sortIcon}
      </span>

      <span className={`${ROOT}__project-manager`}>
        {msg().Psa_Lbl_ProjectManager} {sortIcon}
      </span>

      <span className={`${ROOT}__status`}>
        {msg().Com_Lbl_Status} {sortIcon}
      </span>

      <span className={`${ROOT}__role-title`}>
        {msg().Psa_Lbl_ProjectRoleTitle} {sortIcon}
      </span>

      <span className={`${ROOT}__resource-group`}>
        {msg().Psa_Lbl_ResourceGroup} {sortIcon}
      </span>

      <span className={`${ROOT}__received-date`}>
        {msg().Psa_Lbl_ReceivedDate} {sortIcon}
      </span>

      <span className={`${ROOT}__assignment-due-date`}>
        {msg().Psa_Lbl_AssignmentDueDateList} {sortIcon}
      </span>
    </MultiColumnsGrid>
  );
};

export default ListHeader;
