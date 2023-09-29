import React, { useEffect } from 'react';

import {
  MAX_PAGE_NUM,
  MAX_RECORD_NUM,
  PAGE_SIZE_OPTIONS,
} from '@apps/commons/constants/psa/page';

import Pagination from '@apps/commons/components/Pagination';
import EmptyScreenContainer from '@apps/commons/containers/psa/EmptyScreenContainer';
import msg from '@apps/commons/languages';

import { PageData } from '@apps/domain/models/psa/Request';

import ListBody from './ListBody';
import ListHeader from './ListHeader';

import './index.scss';

const ROOT = 'ts-resource__list';

type Props = {
  noAccessToPsaGroup: boolean;
  onClickPagerLink: (arg0: number, arg1: number) => void;
  onClickRequestListItem: (requestId?: string) => void;
  pageNum: number;
  pageSize: number;
  requestList: PageData;
  totalRecords: number;
};

const RoleRequestList = (props: Props) => {
  useEffect(() => {
    // scroll to the top
    const containerEl = document.querySelector('.ts-container');
    if (containerEl) {
      containerEl.scrollTop = 0;
    }
  }, [props.pageNum]);

  let requestList;

  if (props.requestList && props.requestList.length > 0) {
    requestList = (
      <div className={`${ROOT}__container`}>
        <ListHeader />
        <ListBody
          onClickRequestListItem={props.onClickRequestListItem}
          requestList={props.requestList}
        />
        {props.pageNum === MAX_PAGE_NUM &&
          props.totalRecords > MAX_RECORD_NUM && (
            <div className={`${ROOT}-too-many-results`}>
              {msg().Com_Lbl_TooManySearchResults}
            </div>
          )}

        <Pagination
          allowLargerPageSize
          className={`${ROOT}__list-pager`}
          currentPage={props.pageNum}
          displayNum={5}
          havePagerInfo
          maxPageNum={MAX_PAGE_NUM}
          onChangePageSize={(pageSize) => props.onClickPagerLink(0, pageSize)}
          onClickPagerLink={(num) =>
            props.onClickPagerLink(num, props.pageSize)
          }
          pageSize={PAGE_SIZE_OPTIONS}
          totalNum={props.totalRecords}
        />
      </div>
    );
  } else if (props.noAccessToPsaGroup) {
    requestList = (
      <EmptyScreenContainer
        headerMessage={msg().Psa_Msg_NoAccessToPsaGroup}
        bodyMessage={''}
      />
    );
  } else {
    requestList = (
      <EmptyScreenContainer
        headerMessage={msg().Psa_Lbl_EmptyRoleRequestHeader}
        bodyMessage={msg().Psa_Lbl_EmptyRoleRequestBody}
      />
    );
  }

  return <div className={`${ROOT}`}>{requestList}</div>;
};

export default RoleRequestList;
