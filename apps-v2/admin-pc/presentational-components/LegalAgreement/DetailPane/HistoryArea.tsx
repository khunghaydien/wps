import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { ConfigListMap } from '@apps/admin-pc/utils/ConfigUtil';
import * as RecordUtil from '@apps/admin-pc/utils/RecordUtil';

import { DetailPaneHeaderSubHistory } from '@apps/admin-pc/components/MainContents/DetailPane';
import DetailPaneBody from '@apps/admin-pc/components/MainContents/DetailPane/DetailPaneBody';

const Hr = styled.hr`
  margin: 0 12px 12px;
`;

const Ul = styled.ul`
  margin: 12px;
  li {
    border: 1px solid #ddd;
    border-bottom: 0;
    background: white;
    color: #53688c;
    font-size: 13px;
  }
  li:first-child {
    background: #f5f6fa;
  }
  li:last-child {
    border-bottom: 1px solid #ddd;
  }
`;

const Date = styled.div`
  display: inline-block;
  width: 120px;
  padding: 4px;
`;

const Comment = styled.div`
  display: inline-block;
  width: calc(100% - 120px);
  padding: 4px;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

type Props = {
  id: string;
  history: ConfigListMap['history'];
  modeBase: string;
  modeHistory: string;
  checkboxes: Record<string, unknown>;
  currentHistory: string;
  searchHistory: Array<any>;
  tmpEditRecord: RecordUtil.Record;
  tmpEditRecordHistory: RecordUtil.Record;
  sfObjFieldValues: Record<string, unknown>;
  getOrganizationSetting: Record<string, unknown>;
  useFunction: Record<string, unknown>;
  getBaseValue: (key: string) => void;
  getHistoryValue: (key: string) => void;
  onChangeCheckBoxHistory: (
    e: React.SyntheticEvent<HTMLInputElement>,
    key: string
  ) => void;
  onClickDeleteHistoryButton: () => void;
  onClickRevisionButton: () => void;
  onChangeHistory: (arg0: string) => void;
  onChangeDetailItemHistory: (
    arg0: string,
    arg1: any,
    charType?: string
  ) => void;
};

const RevisionList: React.FC<{
  histories: Props['searchHistory'];
}> = ({ histories }) => {
  if (histories.length < 1) {
    return null;
  }

  return (
    <>
      <Hr />
      <Ul>
        <li>
          <Date>{msg().Admin_Lbl_RevisionDate}</Date>
          <Comment>{msg().Admin_Lbl_ReasonForRevision}</Comment>
        </li>
        {histories.map((history) => {
          return (
            <li key={history.id}>
              <Date>{DateUtil.customFormat(history.validDateFrom, 'L')}</Date>
              <Comment>{history.comment}</Comment>
            </li>
          );
        })}
      </Ul>
    </>
  );
};

const HistoryArea: React.FC<Props> = ({
  id,
  history,
  modeBase,
  modeHistory,
  checkboxes,
  currentHistory,
  searchHistory,
  tmpEditRecord,
  tmpEditRecordHistory,
  sfObjFieldValues,
  getOrganizationSetting,
  useFunction,
  getBaseValue,
  getHistoryValue,
  onChangeCheckBoxHistory,
  onClickDeleteHistoryButton,
  onClickRevisionButton,
  onChangeHistory,
  onChangeDetailItemHistory,
}) => (
  <div>
    <DetailPaneHeaderSubHistory
      id={id}
      modeBase={modeBase}
      modeHistory={modeHistory}
      onClickDeleteHistoryButton={onClickDeleteHistoryButton}
      onClickRevisionButton={onClickRevisionButton}
      onChangeHistory={onChangeHistory}
      currentHistory={currentHistory}
      searchHistory={searchHistory}
      title={msg().Admin_Lbl_HistoryProperties}
    />
    <DetailPaneBody
      checkboxes={checkboxes}
      configList={history}
      baseValueGetter={getBaseValue}
      historyValueGetter={getHistoryValue}
      disabled={modeHistory === ''}
      mode={modeHistory}
      getOrganizationSetting={getOrganizationSetting}
      onChangeCheckBox={onChangeCheckBoxHistory}
      onChangeDetailItem={onChangeDetailItemHistory}
      sfObjFieldValues={sfObjFieldValues}
      tmpEditRecord={tmpEditRecordHistory}
      tmpEditRecordBase={tmpEditRecord}
      useFunction={useFunction}
    />
    <RevisionList histories={searchHistory} />
  </div>
);

export default HistoryArea;
