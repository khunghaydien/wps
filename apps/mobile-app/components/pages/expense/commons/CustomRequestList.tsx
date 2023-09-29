import React, { FunctionComponent } from 'react';

import { isEmpty } from 'lodash';

import msg from '../../../../../commons/languages';
import Navigation from '../../../molecules/commons/Navigation';
import EmptyIcon from '@apps/mobile-app/components/molecules/commons/EmptyIcon';
import SearchArea from '@apps/mobile-app/components/molecules/commons/SearchArea';

import { CustomRequestList as TypeCustomRequestList } from '@apps/domain/models/exp/CustomRequest';

import { FilterList } from '@apps/mobile-app/containers/pages/expense/CustomRequestContainer';

import CustomRequestListItem from '@apps/mobile-app/components/molecules/expense/CustomRequestListItem';

import './CustomRequestList.scss';

const ROOT = 'mobile-app-pages-expense-custom-request-list';

type Props = {
  customRequestList: TypeCustomRequestList;
  filterList: FilterList;
  limitNumber: number;
  onClickCustomRequestItem: (id: string, title: string) => void;
  onClickFilterItem: (key: string) => void;
  onClickResetSearchCondition: () => void;
  onClickBack: () => void;
};

const CustomRequestList: FunctionComponent<Props> = (props) => {
  const {
    filterList,
    limitNumber,
    customRequestList,
    onClickCustomRequestItem,
    onClickFilterItem,
    onClickResetSearchCondition,
    onClickBack,
  } = props;

  const customRequesLimitList = customRequestList.slice(0, limitNumber);

  return (
    <section className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_CustomRequest}
        onClickBack={onClickBack}
      />
      <div className={`${ROOT}__content`}>
        <SearchArea
          filterList={filterList}
          onClickFilterItem={onClickFilterItem}
          onClickResetSearchCondition={onClickResetSearchCondition}
        />
        <div className={`${ROOT}__count`}>
          {`${customRequesLimitList.length} ${msg().Exp_Lbl_RecordCount}`}
        </div>
        {isEmpty(customRequestList) ? (
          <EmptyIcon
            className={`${ROOT}__empty`}
            message={msg().Cmn_Lbl_SuggestNoResult}
          />
        ) : (
          customRequesLimitList.map((customRequestItem) => (
            <CustomRequestListItem
              key={customRequestItem.id}
              {...customRequestItem}
              onClickCustomRequestItem={onClickCustomRequestItem}
            />
          ))
        )}
        {customRequestList.length > limitNumber && (
          <div className={`${ROOT}__hasMore`}>
            {msg().Com_Lbl_TooManySearchResults}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomRequestList;
