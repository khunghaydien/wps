import * as React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import { Button, Dialog, Text } from '../../../core';
import DateField from '@apps/commons/components/fields/DateField';

import { Jobable } from '@apps/domain/models/time-tracking/Job';

import ConditionalSearch, {
  Props as $ConditionalSearchProps,
} from './ConditionalSearch';
import ExploreInHierarchy, {
  Props as $ExploreInHierarchyProps,
} from './ExploreInHierarchy';
import LoadingScreen from './LoadingScreen';

type ExploreInHierarchyProps<T extends Jobable> = Omit<
  $ExploreInHierarchyProps<T>,
  'isShow'
>;
type ConditionalSearchProps<T extends Jobable> = Omit<
  $ConditionalSearchProps<T>,
  'isShow'
>;

const SearchMode = {
  ExploreInHierarchy: 'ExploreInHierarchy',
  ConditionalSearch: 'ConditionalSearch',
} as const;
type SearchModeType = typeof SearchMode[keyof typeof SearchMode];

export type Props<T extends Jobable> = {
  'data-testid'?: string;
  isModal: boolean;
  onClose: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  targetDate?: string;
  isTargetDateFieldEnabled?: boolean;
  updateTargetDate?: (arg0: string) => void;
  exploreInHierarchyProps: ExploreInHierarchyProps<T> & {
    onOk: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  };
  conditionalSearchProps: ConditionalSearchProps<T> & {
    onOk: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  };
  defaultSearchMode?: SearchModeType;
  useConditionalSearch?: boolean;
};

const SContent = {
  Container: styled.div`
    position: relative;
    width: 964px;
    height: 475px;
    display: flex;
    flex-direction: column;
  `,
  ModeSwitcher: styled.div`
    flex: 0 0 56px;
    padding: 12px 20px;

    button {
      width: 153px;
      padding: 0 6px;
      border-color: #2782ed;
      border-radius: 0;
      border-left-width: 0;
      font-weight: bold;

      &:first-child {
        border-left-width: 1px;
        border-radius: 4px 0 0 4px;
      }

      &:last-child {
        border-radius: 0 4px 4px 0;
      }
    }
  `,
};

const Content = <T extends Jobable>({
  searchMode,
  switchSearchMode,
  exploreInHierarchyProps,
  conditionalSearchProps,
  useConditionalSearch,
}: {
  searchMode: SearchModeType;
  switchSearchMode: (arg0: SearchModeType) => void;
  exploreInHierarchyProps: ExploreInHierarchyProps<T>;
  conditionalSearchProps: ConditionalSearchProps<T>;
  useConditionalSearch: boolean;
}) => {
  return (
    <SContent.Container>
      <LoadingScreen
        isLoading={
          searchMode === SearchMode.ConditionalSearch &&
          conditionalSearchProps.isLoading
        }
      />
      <SContent.ModeSwitcher>
        <Button
          key="ExploreInHierarchy"
          onClick={() => switchSearchMode(SearchMode.ExploreInHierarchy)}
          color={
            searchMode === SearchMode.ExploreInHierarchy ? 'primary' : 'default'
          }
        >
          {msg().Time_Lbl_SelectFromCategory}
        </Button>
        {useConditionalSearch && (
          <Button
            key="ConditionalSearch"
            onClick={() => switchSearchMode(SearchMode.ConditionalSearch)}
            color={
              searchMode === SearchMode.ConditionalSearch
                ? 'primary'
                : 'default'
            }
          >
            {msg().Time_Lbl_SearchSelect}
          </Button>
        )}
      </SContent.ModeSwitcher>

      <ExploreInHierarchy
        key="exploreInHierarchy"
        {...exploreInHierarchyProps}
        isShow={searchMode === SearchMode.ExploreInHierarchy}
      />

      <ConditionalSearch
        key="conditionalSearch"
        {...conditionalSearchProps}
        isShow={searchMode === SearchMode.ConditionalSearch}
      />
    </SContent.Container>
  );
};

const SFrame = {
  Header: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  Title: styled.h2`
    color: #53688c;
    font-size: 20px;
    font-weight: bold;
    padding: 15px 0 16px 20px;
  `,
  Text: styled(Text)`
    color: inherit;
  `,
  DateField: styled.div`
    padding: 15px 20px 16px 0px;
  `,

  Footer: styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
    height: 100%;
  `,
  CancelButton: styled(Button)`
    padding-right: 16px;
    padding-left: 16px;
    margin: 0 16px 0 0;
    width: 100px;
  `,
  OkButton: styled(Button)`
    padding-right: 16px;
    padding-left: 16px;
    width: 80px;
  `,
};

const JobSelectDialog = <T extends Jobable>({
  isModal,
  onClose,
  exploreInHierarchyProps,
  conditionalSearchProps,
  defaultSearchMode = SearchMode.ExploreInHierarchy,
  useConditionalSearch = false,
  ...props
}: Props<T>) => {
  const [searchMode, setSearchMode] =
    React.useState<SearchModeType>(defaultSearchMode);

  const { onOk: onOkForExploreInHierarchy, ...restExploreInHierarchyProps } =
    exploreInHierarchyProps;
  const { onOk: onOkForConditionalSearch, ...restConditionalSearchProps } =
    conditionalSearchProps;

  const onOk = React.useMemo(
    () =>
      ({
        [SearchMode.ExploreInHierarchy]: onOkForExploreInHierarchy,
        [SearchMode.ConditionalSearch]: onOkForConditionalSearch,
      }[searchMode]),
    [searchMode, onOkForExploreInHierarchy, onOkForConditionalSearch]
  );

  const isOkDisabled = React.useMemo(
    () =>
      isNil(
        {
          [SearchMode.ExploreInHierarchy]:
            restExploreInHierarchyProps.selectedJob,
          [SearchMode.ConditionalSearch]:
            restConditionalSearchProps.selectedJob,
        }[searchMode]
      ),
    [
      searchMode,
      restExploreInHierarchyProps.selectedJob,
      restConditionalSearchProps.selectedJob,
    ]
  );

  return (
    <Dialog
      data-testid={props['data-testid']}
      isModal={isModal}
      onClose={onClose}
      header={
        <SFrame.Header>
          <SFrame.Title>{msg().Time_Lbl_JobSelect}</SFrame.Title>
          {props.isTargetDateFieldEnabled && (
            <SFrame.DateField>
              <SFrame.Text size="large">{`${
                msg().Admin_Lbl_TargetDate
              } : `}</SFrame.Text>
              <DateField
                value={props.targetDate}
                onChange={props.updateTargetDate}
              />
            </SFrame.DateField>
          )}
        </SFrame.Header>
      }
      content={
        <Content
          searchMode={searchMode}
          switchSearchMode={setSearchMode}
          exploreInHierarchyProps={restExploreInHierarchyProps}
          conditionalSearchProps={restConditionalSearchProps}
          useConditionalSearch={useConditionalSearch}
        />
      }
      footer={
        <SFrame.Footer>
          <SFrame.CancelButton onClick={onClose}>
            {msg().Com_Btn_Cancel}
          </SFrame.CancelButton>
          <SFrame.OkButton
            color="primary"
            onClick={onOk}
            disabled={isOkDisabled}
          >
            {msg().Com_Btn_Decide}
          </SFrame.OkButton>
        </SFrame.Footer>
      }
    />
  );
};

export default JobSelectDialog;
