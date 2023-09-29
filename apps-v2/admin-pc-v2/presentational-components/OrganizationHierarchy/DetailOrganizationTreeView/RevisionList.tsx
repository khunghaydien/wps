// NOTE: Just cloned parts of DetailPane
import React from 'react';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { OrganizationHierarchyHistory } from '@apps/domain/models/organization/OrganizationHierarchy';

import DetailSectionHeader from '@admin-pc/components/MainContents/DetailPane/DetailSectionHeader';

import './RevisionList.scss';

type Props = {
  searchHistory: OrganizationHierarchyHistory[];
};

const ROOT =
  'admin-pc-v2-organization-hierarchy-detail-organization-tree-view-revision-list';

const RevisionList: React.FC<Props> = ({ searchHistory }) => {
  if (searchHistory.length < 1) {
    return null;
  }

  return (
    <>
      <DetailSectionHeader className={`${ROOT}__revision-header`}>
        {msg().Admin_Lbl_RevisionHistory}
      </DetailSectionHeader>
      <ul className={`${ROOT}__revision`}>
        <li className={`${ROOT}__revision-title`}>
          <div className={`${ROOT}__revision-title__date`}>
            {msg().Admin_Lbl_RevisionDate}
          </div>
          <div className={`${ROOT}__revision-title__comment`}>
            {msg().Admin_Lbl_ReasonForRevision}
          </div>
        </li>
        {searchHistory.map((history) => {
          return (
            <li key={history.id} className={`${ROOT}__revision-item`}>
              <div className={`${ROOT}__revision-item__date`}>
                {DateUtil.customFormat(history.validDateFrom, 'L')}
              </div>
              <div className={`${ROOT}__revision-item__comment`}>
                {history.comment}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RevisionList;
