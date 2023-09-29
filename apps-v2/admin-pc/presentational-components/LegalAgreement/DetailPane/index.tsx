import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import configList from '../../../constants/configList/legalAgreement';
import fieldType from '@apps/admin-pc/constants/fieldType';

import msg from '@apps/commons/languages';

import { ConfigList } from '@apps/admin-pc/utils/ConfigUtil';
import * as RecordUtil from '@apps/admin-pc/utils/RecordUtil';

import {
  DetailPaneHeaderCtrl,
  DetailPaneHeaderSubBase,
} from '@apps/admin-pc/components/MainContents/DetailPane';
import DetailPaneBody from '@apps/admin-pc/components/MainContents/DetailPane/DetailPaneBody';
import HistoryDialog from '@apps/admin-pc/components/MainContents/DetailPane/HistoryDialog';

import HistoryArea from './HistoryArea';

const Wrapper = styled.div`
  height: 100%;
  background-color: #f2f4f5;
`;
const Scroll = styled.div`
  overflow: auto;
  height: calc(100% - 34px);
  .admin-pc-contents-detail-pane__header {
    background-color: #c7dae2;
  }
`;

export type Props = {
  currentHistory: string;
  editRecord: RecordUtil.Record;
  editRecordHistory: RecordUtil.Record;
  getOrganizationSetting: Record<string, unknown>;
  isSinglePane: boolean;
  isShowRevisionDialog: boolean;
  getConstants: () => void;
  searchGroup: () => void;
  onChangeDetailItem: (arg0: string, arg1: any, charType?: string) => void;
  onChangeDetailItemHistory: (
    arg0: string,
    arg1: any,
    charType?: string
  ) => void;
  onChangeHistory: (arg0: string) => void;
  onClickCancelButton: () => void;
  onClickCancelEditButton: () => void;
  onClickEditDetailButton: () => void;
  onClickRevisionButton: () => void;
  onClickDeleteButton: () => void;
  onClickDeleteHistoryButton: () => void;
  onClickSaveButton: () => void;
  onClickCreateHistoryButton: () => void;
  onClickUpdateButton: () => void;
  onClickUpdateHistoryButton: () => void;
  onClickRevisionStartButton: (arg0: {
    targetDate: string;
    comment: string;
  }) => void;
  searchHistory: [];
  sfObjFieldValues: Record<string, unknown>;
  tmpEditRecord: RecordUtil.Record;
  tmpEditRecordHistory: RecordUtil.Record;
  modeBase: string;
  modeHistory: string;
  useFunction: Record<string, unknown>;
};

const DetailPane: React.FC<Props> = ({
  isSinglePane,
  modeBase,
  modeHistory,
  isShowRevisionDialog,
  editRecord,
  editRecordHistory,
  tmpEditRecord,
  tmpEditRecordHistory,
  currentHistory,
  searchHistory,
  sfObjFieldValues,
  useFunction,
  getConstants,
  searchGroup,
  onChangeDetailItem,
  onChangeDetailItemHistory,
  onClickCancelButton,
  onClickCancelEditButton,
  onClickSaveButton,
  onClickUpdateButton,
  onClickCreateHistoryButton,
  onClickUpdateHistoryButton,
  onClickDeleteButton,
  onClickEditDetailButton,
  getOrganizationSetting,
  onClickRevisionStartButton,
  onClickDeleteHistoryButton,
  onClickRevisionButton,
  onChangeHistory,
}) => {
  const [checkboxes, setCheckBoxes] = useState({});

  const getBaseValue = useCallback(
    (key: string) => {
      const baseValue = RecordUtil.getter(tmpEditRecord)(key);
      return baseValue;
    },
    [tmpEditRecord]
  );

  const getHistoryValue = useCallback(
    (key: string) => {
      const historyValue = RecordUtil.getter(tmpEditRecordHistory)(key);
      return historyValue;
    },
    [tmpEditRecordHistory]
  );

  const onChangeCheckBox = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>, key: string) => {
      const isChecked = e.currentTarget.checked;
      setCheckBoxes({ ...checkboxes, key: isChecked });
      onChangeDetailItem(key, e.currentTarget.checked);
    },
    [checkboxes, onChangeDetailItem]
  );

  const onChangeCheckBoxHistory = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>, key: string) => {
      const isChecked = e.currentTarget.checked;
      setCheckBoxes({ ...checkboxes, key: isChecked });
      onChangeDetailItemHistory(key, e.currentTarget.checked);
    },
    [checkboxes, onChangeDetailItemHistory]
  );

  const creatCheckBoxes = (
    editRecord: RecordUtil.Record,
    configList?: ConfigList
  ) => {
    if (configList) {
      const tempCheckboxes = { ...checkboxes };

      const evalConfigTree = (targetConfigList: ConfigList) => {
        targetConfigList.forEach((config) => {
          if (config.section && config.configList) {
            evalConfigTree(config.configList);
          } else if (config.type === fieldType.FIELD_CHECKBOX && config.key) {
            tempCheckboxes[config.key] = editRecord[config.key] || false;
          }
        });
      };
      evalConfigTree(configList);

      return { checkboxes: tempCheckboxes };
    }
  };

  const $onClickCancelEditButton = () => {
    creatCheckBoxes(editRecord, configList.base);
    creatCheckBoxes(editRecordHistory, configList.history);
    onClickCancelEditButton();
  };

  useEffect(() => {
    getConstants();
    searchGroup();
  }, []);

  useEffect(() => {
    creatCheckBoxes(editRecord, configList.base);
    creatCheckBoxes(editRecordHistory, configList.history);
  }, [editRecord, editRecordHistory]);

  return (
    <Wrapper>
      <DetailPaneHeaderCtrl
        isSinglePane={isSinglePane}
        modeBase={modeBase}
        modeHistory={modeHistory}
        isDisplayCloneButton={false}
        onClickCloseButton={onClickCancelButton}
        onClickCancelButton={$onClickCancelEditButton}
        onClickSaveButton={onClickSaveButton}
        onClickUpdateBaseButton={onClickUpdateButton}
        onClickCreateHistoryButton={onClickCreateHistoryButton}
        onClickUpdateHistoryButton={onClickUpdateHistoryButton}
      />
      <Scroll>
        <DetailPaneHeaderSubBase
          isSinglePane={isSinglePane}
          modeBase={modeBase}
          modeHistory={modeHistory}
          onClickDeleteButton={onClickDeleteButton}
          onClickEditButton={onClickEditDetailButton}
          title={msg().Admin_Lbl_BaseInfo}
        />
        <DetailPaneBody
          mode={modeBase}
          checkboxes={checkboxes}
          configList={configList.base}
          baseValueGetter={getBaseValue}
          historyValueGetter={getHistoryValue}
          disabled={!modeBase}
          getOrganizationSetting={getOrganizationSetting}
          onChangeCheckBox={onChangeCheckBox}
          onChangeDetailItem={onChangeDetailItem}
          sfObjFieldValues={sfObjFieldValues}
          tmpEditRecord={tmpEditRecord}
          renderDetailExtraArea={null}
          useFunction={useFunction}
        />
        {configList.history ? (
          <HistoryArea
            onChangeCheckBoxHistory={onChangeCheckBoxHistory}
            id={editRecord?.id}
            history={configList.history}
            modeBase={modeBase}
            modeHistory={modeHistory}
            checkboxes={checkboxes}
            currentHistory={currentHistory}
            searchHistory={searchHistory}
            tmpEditRecord={tmpEditRecord}
            tmpEditRecordHistory={tmpEditRecordHistory}
            sfObjFieldValues={sfObjFieldValues}
            getOrganizationSetting={getOrganizationSetting}
            useFunction={useFunction}
            getBaseValue={getBaseValue}
            getHistoryValue={getHistoryValue}
            onClickDeleteHistoryButton={onClickDeleteHistoryButton}
            onClickRevisionButton={onClickRevisionButton}
            onChangeHistory={onChangeHistory}
            onChangeDetailItemHistory={onChangeDetailItemHistory}
          />
        ) : null}
        {isShowRevisionDialog ? (
          <HistoryDialog
            onClickCancelButton={$onClickCancelEditButton}
            onClickSaveButton={onClickRevisionStartButton}
            title={msg().Admin_Lbl_Revision}
          />
        ) : null}
      </Scroll>
    </Wrapper>
  );
};

export default DetailPane;
