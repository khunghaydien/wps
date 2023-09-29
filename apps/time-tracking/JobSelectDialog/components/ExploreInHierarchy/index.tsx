import * as React from 'react';

import isNil from 'lodash/isNil';

import styled from 'styled-components';

import { Icons, Spinner, Text } from '@apps/core';
import { Color } from '@apps/core/styles';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';

import { Jobable } from '@apps/domain/models/time-tracking/Job';

import { JobTree } from '../../hooks/useJobTree';
import LazyLoading from './LazyLoading';
import ListItem from './ListItem';
import QuickSearchableList from './QuickSearchableList';
import Snackbar from './Snackbar';

export type Props<T extends Jobable> = {
  isShow: boolean;
  initialize: () => () => void;
  jobsList: JobTree<T>;
  selectedJob: T | null | undefined;
  isOpenedJob: (arg0: T) => boolean;
  onClickItem: (level: number, arg1: T, key: string) => void;
  onSearch: (key: string, parent: T, codeOrName: string) => void;
};

const S = {
  Content: styled.div<{ isShow: boolean }>`
    border-top: 1px ${Color.border1} solid;
    display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
    flex-flow: row nowrap;
    justify-content: flex-start;
    width: 964px;
    overflow: auto;
  `,
  Column: styled.div`
    border-right: 1px ${Color.border1} solid;
    position: relative;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItemContent: styled.div`
    display: flex;
    flex-flow: column nowrap;
    width: 168px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    :focus {
      outline: none;
    }
  `,
  TooltipContent: styled.div`
    display: flex;
    flex-flow: column nowrap;
    width: 190px;
  `,
  Text: styled(Text)`
    color: inherit;
  `,
  LockedIcon: styled(Icons.Locked)`
    fill: #828282;
    margin-right: 8px;
    height: 14px;
    width: 14px;
  `,
  Spacer: styled.div`
    width: 22px;
  `,
};

const ExploreInHierarchy = <T extends Jobable>({
  isShow,
  initialize,
  jobsList,
  selectedJob,
  isOpenedJob,
  onClickItem,
  onSearch,
}: Props<T>) => {
  React.useEffect(initialize, [initialize]);

  return (
    <S.Content isShow={isShow}>
      {jobsList.map(({ key, value, searchQuery }, level) => {
        const onSearchInHierarchy = (codeOrName: string) =>
          onSearch(key, searchQuery.parent, codeOrName);
        return (
          <S.Column key={key}>
            <LazyLoading it={value}>
              {({ items: jobs, isDone }) => (
                <>
                  <QuickSearchableList
                    isTall={jobs.some((job) => job.validFrom && job.validTo)}
                    items={jobs}
                    isLoadDone={isDone}
                    onSearch={onSearchInHierarchy}
                    initialSearchWord={searchQuery.codeOrName}
                  >
                    {(job: T) => (
                      <ListItem
                        key={job.id}
                        opened={isOpenedJob(job)}
                        selected={
                          !isNil(selectedJob) && job.id === selectedJob.id
                        }
                        hasChildren={job.hasChildren}
                        onClick={() => onClickItem(level, job, key)}
                      >
                        <S.ListItem>
                          {job.isEditLocked ? (
                            <Tooltip
                              id={job.id}
                              content={
                                <S.TooltipContent tabIndex={0}>
                                  <S.Text size="large">
                                    {msg().Time_Lbl_LockedJobToolTip}
                                  </S.Text>
                                </S.TooltipContent>
                              }
                              align="top left"
                            >
                              <S.LockedIcon />
                            </Tooltip>
                          ) : (
                            <S.Spacer />
                          )}
                          <Tooltip
                            id={job.id}
                            content={
                              <S.TooltipContent tabIndex={0}>
                                <S.Text size="small">{job.code}</S.Text>
                                <S.Text size="large">{job.name}</S.Text>
                                {job.validFrom && job.validTo && (
                                  <S.Text size="small">
                                    {job.validFrom} - {job.validTo}
                                  </S.Text>
                                )}
                              </S.TooltipContent>
                            }
                            align="top left"
                          >
                            <S.ListItemContent tabIndex={0}>
                              <S.Text size="small">{job.code}</S.Text>
                              <S.Text size="large">{job.name}</S.Text>
                              {job.validFrom && job.validTo && (
                                <S.Text size="small">
                                  {job.validFrom} - {job.validTo}
                                </S.Text>
                              )}
                            </S.ListItemContent>
                          </Tooltip>
                        </S.ListItem>
                      </ListItem>
                    )}
                  </QuickSearchableList>
                  <Snackbar
                    isOpen={!isDone}
                    align="bottom"
                    addon={<Spinner size="x-small" variant="inverse" />}
                    message={msg().Com_Lbl_Loading}
                  />
                </>
              )}
            </LazyLoading>
          </S.Column>
        );
      })}
    </S.Content>
  );
};

export default ExploreInHierarchy;
