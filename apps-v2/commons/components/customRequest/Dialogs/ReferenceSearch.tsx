import React, { useState } from 'react';

import styled from 'styled-components';

import { Color } from '@apps/core/styles';
import Button from '@commons/components/buttons/Button';
import DialogFrame from '@commons/components/dialogs/DialogFrame';
import Icon from '@commons/components/exp/Icon';
import TextField from '@commons/components/fields/TextField';
import FixedHeaderTable, {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
} from '@commons/components/FixedHeaderTable';
import msg from '@commons/languages';
import colors from '@commons/styles/exp/variables/_colors.scss';

import { MAX_SEARCH_NO } from '@apps/domain/models/customRequest/consts';
import {
  LayoutData,
  ReferenceRecords,
} from '@apps/domain/models/customRequest/types';

export const S = {
  Dialog: styled(DialogFrame)`
    width: 800px;
    .commons-dialog-frame__contents {
      padding: 20px;
    }
  `,
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
  Count: styled.div`
    text-align: right;
    margin-top: 16px;
  `,
  Message: styled.div`
    padding-top: 4px;
    width: 100%;
    color: ${Color.error};
    text-align: right;
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
      height: 400px;
    }
  `,
  HeaderCell: styled(HeaderCell)`
    width: ${(props: { width: number }) => `${props.width}%`};
  `,
  BodyCell: styled(BodyCell)`
    width: ${(props: { width: number }) => `${props.width}%`};
  `,
};

export type Props = {
  onHide: () => void;
  onSearchReference: (query) => void;
  onClickRecord: (record) => void;
  referenceLayout: Array<LayoutData>;
  referenceRecords: ReferenceRecords;
};

const ReferenceSearch = (props: Props) => {
  const [keyword, setKeyword] = useState('');
  const headerData = props.referenceLayout || [];
  const width = 100 / (headerData.length || 1);
  const headerCells = headerData.map(({ label, name }) => {
    return <S.HeaderCell width={width}>{label || name}</S.HeaderCell>;
  });
  const records = props.referenceRecords || [];
  const rows = records.slice(0, MAX_SEARCH_NO).map((record) => {
    return (
      <S.Row
        key={record.Id}
        // @ts-ignore
        onClick={() => props.onClickRecord(record)}
      >
        {headerData.map(({ name }) => {
          return <S.BodyCell width={width}>{record[name]}</S.BodyCell>;
        })}
      </S.Row>
    );
  });

  const onChangeSearchField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      props.onSearchReference(keyword);
    }
  };

  return (
    <S.Dialog
      title={msg().Exp_Lbl_SearchResult}
      hide={props.onHide}
      footer={
        <DialogFrame.Footer>
          <Button onClick={props.onHide}>{msg().Com_Btn_Close}</Button>
        </DialogFrame.Footer>
      }
    >
      <S.SearchField>
        <S.SearchInput
          // @ts-ignore
          onKeyPress={onKeyPress}
          value={keyword}
          placeholder={msg().Com_Lbl_Search}
          onChange={onChangeSearchField}
        />

        <S.SearchIcon type="search" />
      </S.SearchField>
      <S.Count>{`${rows.length} ${msg().Exp_Lbl_RecordCount}`}</S.Count>
      <S.Table>
        <HeaderRow>{headerCells}</HeaderRow>
        {rows}
      </S.Table>
      {records.length > MAX_SEARCH_NO && (
        <S.Message>{msg().Com_Lbl_TooManySearchResults}</S.Message>
      )}
    </S.Dialog>
  );
};

export default ReferenceSearch;
