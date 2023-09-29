import React, { useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import styled, { css } from 'styled-components';

import Icon from '@apps/commons/components/exp/Icon';
import TextField from '@apps/commons/components/fields/TextField';
import FixedHeaderTable, {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
} from '@apps/commons/components/FixedHeaderTable';
import Skeleton from '@apps/commons/components/Skeleton';
import msg from '@apps/commons/languages';
import colors from '@apps/commons/styles/exp/variables/_colors.scss';
import { Color } from '@apps/core/styles';

import { Delegator } from '@apps/domain/models/exp/DelegateApplicant';
import {
  DEFAULT_LIMIT_NUMBER,
  getJctRegistrationNumber,
  VendorItem,
  VendorItemList,
} from '@apps/domain/models/exp/Vendor';

export type Props = {
  className: string;
  isFinanceApproval: boolean;
  isLoading: boolean;
  selectedDelegator: Delegator;
  useJctRegistrationNumber: boolean;
  vendorRecentlyUsed: VendorItemList;
  onClickVendorItem: (item: VendorItem) => void;
  onVendorSearch: (query: string) => Promise<VendorItemList>;
};

const cellWidthStyles = css<{ columnName: string }>`
  width: ${({ columnName }) => (columnName === 'code' ? `30%` : `70%`)};
`;

const S = {
  SearchField: styled.div`
    position: relative;
  `,
  SearchInput: styled(TextField)`
    padding-left: 32px !important;
  `,
  SearchIcon: styled(Icon)`
    position: absolute;
    top: 4px;
    bottom: 0;
    left: 10px;
    margin: auto;
  `,
  Label: styled.div`
    padding: 10px 0;
  `,
  Count: styled.span`
    float: right;
  `,
  Message: styled.span`
    padding-top: 4px;
    color: ${Color.error};
    float: right;
  `,
  Row: styled(BodyRow)`
    cursor: pointer;
    &:hover {
      background-color: ${colors.backgroundHover};
    }
  `,
  Table: styled(FixedHeaderTable)`
    border: 1px solid ${Color.background};
    .commons-fixed-header-table__scrollable {
      max-height: 265px;
    }
  `,
  HeaderCell: styled(HeaderCell)`
    ${cellWidthStyles}
  `,
  BodyCell: styled(BodyCell)`
    ${cellWidthStyles}
  `,
};

const CompanyVendorList = (props: Props) => {
  const [isSearch, setIsSearch] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      props.onVendorSearch(keyword).then(({ records }: VendorItemList) => {
        setIsSearch(true);
        setHasMore(records.length > DEFAULT_LIMIT_NUMBER);
        setRecords(records.slice(0, DEFAULT_LIMIT_NUMBER));
      });
    }
  };

  const onChangeSearchField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const ROOT = props.className;
  const items = isSearch ? { hasMore, records } : props.vendorRecentlyUsed;
  const label =
    isSearch || !isEmpty(props.selectedDelegator) || props.isFinanceApproval
      ? msg().Exp_Lbl_SearchResult
      : msg().Exp_Lbl_RecentlyUsedItems;
  const count = items.hasMore ? '100+' : items.records.length;

  return (
    <>
      <div>{msg().Exp_Lbl_SearchCodeOrName}</div>
      <S.SearchField>
        <S.SearchInput
          // @ts-ignore
          onKeyPress={onKeyPress}
          value={keyword}
          placeholder={msg().Com_Lbl_PressEnterToSearch}
          onChange={onChangeSearchField}
          data-testid={`${ROOT}__search-field`}
        />

        <S.SearchIcon type="search" />
      </S.SearchField>
      <S.Label>
        <span> {label} </span>
        <S.Count>{isSearch && `${count} ${msg().Exp_Lbl_RecordCount}`}</S.Count>
      </S.Label>
      {props.isLoading ? (
        <Skeleton
          noOfRow={6}
          colWidth="100%"
          className={`${ROOT}__skeleton`}
          rowHeight="25px"
          margin="30px"
        />
      ) : (
        <S.Table>
          <HeaderRow>
            <S.HeaderCell columnName="code">{msg().Exp_Lbl_Code}</S.HeaderCell>
            <S.HeaderCell columnName="name">{msg().Exp_Lbl_Name}</S.HeaderCell>
            {props.useJctRegistrationNumber && (
              <S.HeaderCell columnName="jct-number">
                {msg().Exp_Clbl_JctRegistrationNumber}
              </S.HeaderCell>
            )}
          </HeaderRow>
          {(items as VendorItemList).records.map((item, index) => {
            return (
              <S.Row
                key={item.id}
                // @ts-ignore
                onClick={() => props.onClickVendorItem(item)}
                data-testid={`${ROOT}__row-${index}`}
              >
                <S.BodyCell columnName="code">{item.code}</S.BodyCell>
                <S.BodyCell columnName="name">{item.name}</S.BodyCell>
                {props.useJctRegistrationNumber && (
                  <S.BodyCell columnName="jct-number">
                    {getJctRegistrationNumber(
                      item.jctRegistrationNumber,
                      item.isJctQualifiedInvoiceIssuer
                    )}
                  </S.BodyCell>
                )}
              </S.Row>
            );
          })}
        </S.Table>
      )}

      {hasMore && !props.isLoading && (
        <S.Message>{msg().Com_Lbl_TooManySearchResults}</S.Message>
      )}
    </>
  );
};

export default CompanyVendorList;
