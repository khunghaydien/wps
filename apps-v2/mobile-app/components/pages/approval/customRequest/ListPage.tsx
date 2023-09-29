import React from 'react';

import isEmpty from 'lodash/isEmpty';

import msg from '@commons/languages';
import EmptyIcon from '@mobile/components/molecules/commons/EmptyIcon';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import WrapperWithPermission from '@mobile/components/organisms/commons/WrapperWithPermission';

import { CustomRequest } from '@apps/domain/models/approval/request/Request';

import ReportSummaryListItem from '@mobile/components/molecules/approval/ReportSummaryListItem';

import './ListPage.scss';

const ROOT = 'mobile-app-pages-approval-page-custom-request-list';

type Props = {
  customRequestList: CustomRequest[];
  onClickRequest: (requestId: string, recordTypeId: string) => void;
};

const ExpListPage = ({ customRequestList, onClickRequest }: Props) => {
  return (
    <WrapperWithPermission className={ROOT} hasPermissionError={null}>
      <Navigation
        className={`${ROOT}__nav`}
        title={msg().Appr_Clbl_CustomRequest}
      />
      <div className="main-content">
        <div className={`${ROOT}__count`}>
          <div className={`${ROOT}__num`}>
            {`${customRequestList.length} ${msg().Appr_Lbl_RecordCount}`}
          </div>
        </div>
        <div className={`${ROOT}__list`} id="scrollableDiv">
          {customRequestList.map((request: CustomRequest) => (
            <ReportSummaryListItem
              key={request.Id}
              report={request}
              onClick={() => onClickRequest(request.Id, request.RecordTypeId)}
            />
          ))}
          {isEmpty(customRequestList) && (
            <EmptyIcon
              className={`${ROOT}__empty`}
              message={msg().Appr_Msg_EmptyRequestList}
            />
          )}
        </div>
      </div>
    </WrapperWithPermission>
  );
};

export default ExpListPage;
