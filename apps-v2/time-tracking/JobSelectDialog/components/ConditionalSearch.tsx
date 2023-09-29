import * as React from 'react';

import styled from 'styled-components';

import { Icons, Text } from '@apps/core';
import { Color } from '@apps/core/styles';
import TextField from '@commons/components/fields/TextField';
import FixedHeaderTable, {
  BodyCell,
  BodyRow,
} from '@commons/components/FixedHeaderTable';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';

import { Jobable } from '@apps/domain/models/time-tracking/Job';

const STANDARD_MAX_LENGTH_OF_SEARCH_FIELD = 100;

export type Props<T extends Jobable> = {
  isShow: boolean;
  conditionalSearch: () => any;
  codeOrNameQuery: string;
  setCodeOrNameQuery: (arg0: string) => void;
  isLoading: boolean;
  resultRecords: Array<T> | null;
  hasResultMoreThanRecordCount: boolean;
  onSelectJob: (job: T) => void;
  selectedJob: T | null | undefined;
};

const ClassNames = {
  ResultTable__Scrollable: 'conditional-search-result-table__scrollable',
  ResultTable__HasMoreThanRecordCount:
    'conditional-search-result-table__has-more-than-record-count',
  ResultTableRow__Selected: 'conditional-search-result-table-row__selected',
  ResultTableRowJobLabel: 'conditional-search-result-table-row-job-label',
  ResultTableRowJobLabelPeriod:
    'conditional-search-result-table-row-job-label-period',
};

const S = {
  Container: styled.div<{ isShow: boolean }>`
    border-top: solid 1px ${Color.border1};
    padding: 20px 20px 0;
    flex: 1;
    display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
    flex-direction: column;
  `,

  Conditions: styled.div`
    flex: 0 0 71px;
    position: relative;
    width: 50%;
  `,
  Label: styled.div`
    margin-bottom: 10px;
    font-weight: bold;
    color: ${Color.secondary};
  `,
  Field: styled(TextField)`
    padding-left: 32px !important;
    height: 32px;
    color: ${Color.primary};
  `,
  SearchIcon: styled(Icons.Search)`
    fill: #afadab;
    position: absolute;
    left: 8px;
    margin-top: 8px;
  `,

  Results: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  ResultHeader: styled.div`
    flex: 0;
    display: flex;
    div.title {
      font-weight: bold;
      color: ${Color.secondary};
    }
    div.recordCount {
      flex: 1;
      text-align: right;
      color: ${Color.primary};
    }
  `,
  ResultBody: styled.div`
    flex: 1;
  `,
  ResultTable: styled(FixedHeaderTable)`
    margin: 10px 0 0;
    border: solid 1px ${Color.border1};
    border-radius: 4px;

    > .${ClassNames.ResultTable__Scrollable} {
      max-height: 277px;
    }

    &.${ClassNames.ResultTable__HasMoreThanRecordCount}
      > .${ClassNames.ResultTable__Scrollable} {
      max-height: 256px;
    }
  `,
  ResultTableRow: styled(BodyRow)`
    &&& {
      min-height: 45px;
      border-top: solid 1px ${Color.border1};
      cursor: pointer;

      &:first-child {
        border-top: none;
      }

      &:hover {
        background-color: ${Color.hover};
      }

      &.${ClassNames.ResultTableRow__Selected} {
        background-color: ${Color.accent};
        color: ${Color.base};
      }
    }

    .${ClassNames.ResultTableRowJobLabel} {
      padding: 8px 0;
    }

    .${ClassNames.ResultTableRowJobLabelPeriod} {
      line-height: 1;
    }
  `,
  ResultTableCell: styled(BodyCell)`
    padding: 0 20px 0 42px !important;
    display: flex;
    align-items: center;
  `,
  ResultFooter: styled.div`
    flex: 0;
    padding: 12px 0;
    text-align: right;
    color: ${Color.error};
  `,

  Tooltip: styled(Tooltip)`
    margin-left: -22px;
    height: 18px;
    line-height: 14px;
  `,
  LockedIcon: styled(Icons.Locked)`
    fill: #828282;
    margin-right: 8px;
    height: 14px;
    width: 14px;
  `,
  TooltipContent: styled.div`
    width: 190px;
  `,
  Text: styled(Text)`
    color: inherit;
  `,
};

const ConditionalSearch = <T extends Jobable>({
  isShow,
  conditionalSearch,
  codeOrNameQuery,
  setCodeOrNameQuery,
  isLoading,
  resultRecords,
  hasResultMoreThanRecordCount = false,
  onSelectJob,
  selectedJob,
}: Props<T>) => {
  const onPressEnter = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && e.nativeEvent.isComposing === false) {
        e.preventDefault();
        if (!isLoading) {
          conditionalSearch();
        }
      }
    },
    [isLoading, conditionalSearch]
  );

  return (
    <S.Container isShow={isShow}>
      <S.Conditions>
        <S.Label>{msg().Time_Lbl_SearchCodeOrName}</S.Label>
        <S.Field
          placeholder={msg().Time_Lbl_SearchOnEnter}
          maxLength={STANDARD_MAX_LENGTH_OF_SEARCH_FIELD}
          value={codeOrNameQuery}
          onChange={(_, value) => setCodeOrNameQuery(value)}
          onKeyDown={onPressEnter}
        />
        <S.SearchIcon />
      </S.Conditions>

      <S.Results>
        <S.ResultHeader>
          <div className="title">{msg().Time_Lbl_SearchResult}</div>
          <div className="recordCount">
            {[
              resultRecords !== null ? resultRecords.length : '-',
              hasResultMoreThanRecordCount ? '+' : '',
              ' ',
              msg().Time_Lbl_RecordCount,
            ]}
          </div>
        </S.ResultHeader>

        <S.ResultBody className="ResultBody">
          {resultRecords && resultRecords.length > 0 && (
            <S.ResultTable
              className={
                hasResultMoreThanRecordCount
                  ? ClassNames.ResultTable__HasMoreThanRecordCount
                  : ''
              }
              scrollableClass={ClassNames.ResultTable__Scrollable}
            >
              {resultRecords.map((job) => (
                <S.ResultTableRow
                  data-testid={`conditional-search-result-row-${job.id}`}
                  key={job.id}
                  className={
                    job === selectedJob
                      ? ClassNames.ResultTableRow__Selected
                      : ''
                  }
                  /* @ts-ignore */
                  onClick={() => onSelectJob(job)}
                >
                  <S.ResultTableCell>
                    {job.isEditLocked && (
                      <S.Tooltip
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
                      </S.Tooltip>
                    )}
                    <div className={ClassNames.ResultTableRowJobLabel}>
                      <p>{`${job.code} - ${job.name}`}</p>
                      {job.validFrom && job.validTo && (
                        <p className={ClassNames.ResultTableRowJobLabelPeriod}>
                          <S.Text size="small">{`${job.validFrom} - ${job.validTo}`}</S.Text>
                        </p>
                      )}
                    </div>
                  </S.ResultTableCell>
                </S.ResultTableRow>
              ))}
            </S.ResultTable>
          )}
        </S.ResultBody>

        {hasResultMoreThanRecordCount && (
          <S.ResultFooter className="ResultFooter">
            {msg().Com_Lbl_TooManySearchResults}
          </S.ResultFooter>
        )}
      </S.Results>
    </S.Container>
  );
};

export default ConditionalSearch;
