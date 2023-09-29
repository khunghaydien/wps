import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import configList from '../../../constants/configList/attPattern';
import fieldType from '../../../constants/fieldType';

import msg from '@apps/commons/languages';

import { ConfigList } from '../../../utils/ConfigUtil';
import * as RecordUtil from '../../../utils/RecordUtil';

import {
  DetailPaneHeaderCtrl,
  DetailPaneHeaderSubBase,
} from '../../../components/MainContents/DetailPane';
import DetailPaneBody from '../../../components/MainContents/DetailPane/DetailPaneBody';

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
  editRecord: RecordUtil.Record;
  getOrganizationSetting: Record<string, unknown>;
  isSinglePane: boolean;
  onChangeDetailItem: (arg0: string, arg1: any, charType?: string) => void;
  onClickCancelButton: () => void;
  onClickCancelEditButton: () => void;
  onClickEditDetailButton: () => void;
  onClickDeleteButton: () => void;
  onClickSaveButton: () => void;
  onClickUpdateButton: () => void;
  sfObjFieldValues: Record<string, unknown>;
  tmpEditRecord: RecordUtil.Record;
  modeBase: string;
  useFunction: Record<string, unknown>;
};

const DetailPane: React.FC<Props> = ({
  isSinglePane,
  modeBase,
  editRecord,
  tmpEditRecord,
  sfObjFieldValues,
  useFunction,
  onChangeDetailItem,
  onClickCancelButton,
  onClickCancelEditButton,
  onClickSaveButton,
  onClickUpdateButton,
  onClickDeleteButton,
  onClickEditDetailButton,
  getOrganizationSetting,
}) => {
  const [checkboxes, setCheckBoxes] = useState({});

  const getBaseValue = useCallback(
    (key: string) => {
      const baseValue = RecordUtil.getter(tmpEditRecord)(key);
      return baseValue;
    },
    [tmpEditRecord]
  );

  const onChangeCheckBox = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>, key: string) => {
      const isChecked = e.currentTarget.checked;
      setCheckBoxes({ ...checkboxes, key: isChecked });
      onChangeDetailItem(key, e.currentTarget.checked);
    },
    [checkboxes, onChangeDetailItem]
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
    onClickCancelEditButton();
  };

  useEffect(() => {
    creatCheckBoxes(editRecord, configList.base);
  }, [editRecord]);

  return (
    <Wrapper>
      <DetailPaneHeaderCtrl
        isSinglePane={isSinglePane}
        modeBase={modeBase}
        isDisplayCloneButton={false}
        onClickCloseButton={onClickCancelButton}
        onClickCancelButton={$onClickCancelEditButton}
        onClickSaveButton={onClickSaveButton}
        onClickUpdateBaseButton={onClickUpdateButton}
      />
      <Scroll>
        <DetailPaneHeaderSubBase
          isSinglePane={isSinglePane}
          modeBase={modeBase}
          onClickDeleteButton={onClickDeleteButton}
          onClickEditButton={onClickEditDetailButton}
          title={msg().Admin_Lbl_BaseInfo}
        />
        <DetailPaneBody
          mode={modeBase}
          checkboxes={checkboxes}
          configList={configList.base}
          baseValueGetter={getBaseValue}
          historyValueGetter={() => {}}
          disabled={!modeBase}
          getOrganizationSetting={getOrganizationSetting}
          onChangeCheckBox={onChangeCheckBox}
          onChangeDetailItem={onChangeDetailItem}
          sfObjFieldValues={sfObjFieldValues}
          tmpEditRecord={tmpEditRecord}
          renderDetailExtraArea={null}
          useFunction={useFunction}
        />
      </Scroll>
    </Wrapper>
  );
};

export default DetailPane;
