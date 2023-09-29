import React, { useEffect } from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import configList from '@apps/admin-pc/constants/configList/legalAgreement';

import ListPaneHeader from '@apps/admin-pc/components/MainContents/ListPaneHeader';

import HistoryArea, { Props as HistoryProps } from './HistoryArea';
import LegalAgreementList, { Props as ListProps } from './LegalAgreementList';

type Props = {
  title: string;
  searchList: () => void;
  onClickCreateNewButton: () => void;
} & HistoryProps &
  ListProps;

const ListPaneWrapper = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: $color-bg-pane-second;
  text-align: left;
`;

const GridWrapper = styled.div`
  height: 100%;
  padding: 14px;
`;

const ListPane: React.FC<Props> = ({
  title,
  selectedCode,
  itemList,
  historyTargetDate,
  onChangeHistoryTargetDate,
  onClickCreateNewButton,
  searchList,
  onClickSearchButton,
  onClickRow,
}) => {
  useEffect(() => {
    searchList();
  }, []);

  return (
    <ListPaneWrapper>
      <ListPaneHeader
        title={title}
        historyArea={
          !isNil(configList.history) ? (
            <HistoryArea
              historyTargetDate={historyTargetDate}
              onChangeHistoryTargetDate={onChangeHistoryTargetDate}
              onClickSearchButton={onClickSearchButton}
            />
          ) : null
        }
        onClickCreateNewButton={onClickCreateNewButton}
      />
      <GridWrapper>
        {itemList.length > 0 && (
          <LegalAgreementList
            itemList={itemList}
            selectedCode={selectedCode}
            onClickRow={onClickRow}
          />
        )}
      </GridWrapper>
    </ListPaneWrapper>
  );
};

export default ListPane;
