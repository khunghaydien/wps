import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import _ from 'lodash';

import fieldType from '../../constants/fieldType';

import '../../../commons/styles/modal-transition-slideleft.css';
import msg from '../../../commons/languages';

import * as ConfigUtil from '../../utils/ConfigUtil';
import * as RecordUtil from '../../utils/RecordUtil';

import DetailPane from './DetailPane';
import ListPane from './ListPane';

import './index.scss';

const ROOT = 'admin-pc-contents';

type Props = {
  actions?: any;
  className?: string;
  commonActions?: any;
  configList?: any;
  editRecord?: any;
  sfObjFieldValues?: any;
  title?: string;
  tmpEditRecord?: any;
  companyId?: string;
  editRecordHistory?: any;
  getOrganizationSetting?: any;
  isSinglePane?: boolean;
  itemList?: any;
  onClickCancelEditButton?: any;
  onClickCreateButton?: any;
  onClickCreateHistoryButton?: any;
  onClickCreateNewButton?: any;
  isShowDetailAfterCreate?: boolean;
  onClickEditButton?: any;
  onClickUpdateButton?: any;
  onClickUpdateHistoryButton?: any;
  renderDetailExtraArea?: any;
  searchHistory?: Array<any>;
  value2msgkey?: any;
  tmpEditRecordHistory?: any;
  useFunction?: any;
  moduleType?: any;
  objectType?: any;
  showCloneButton?: boolean;
  isShowRevisionDialog?: boolean;
  hideNewButton?: boolean;
  hideDeleteDetailButton?: boolean;
  listPane?: any;
  modeBase?: any;
  modeHistory?: any;
  isShowDetail?: any;
  componentKey?: any;
  cellActions?: (column: any, row: any) => void;
  component?: React.ReactNode;
  detailTitle?: string;
  hasTargetDate?: boolean;
  searchPsaSetting?: any;
  hideHeaderButton?: boolean;
};

const defaultProps = {
  companyId: '',
  editRecordHistory: {},
  getOrganizationSetting: {},
  onClickCancelEditButton: null,
  onClickCreateButton: null,
  onClickCreateNewButton: null,
  onClickEditButton: null,
  onClickUpdateButton: null,
  renderDetailExtraArea: null,
  itemList: [],
  isSinglePane: false,
  searchHistory: [],
  tmpEditRecordHistory: {},
  value2msgkey: {},
  moduleType: '',
  objectType: '',
  hideNewButton: false,
  hideDeleteDetailButton: false,
  hideHeaderButton: false,
};

/**
 * 設定画面の基礎クラス
 */
const MainContents = (ownProps: Props) => {
  const props = { ...defaultProps, ...ownProps };
  const [state, setState] = useState({
    currentHistory: '',
    historyTargetDate: '',
  });
  const listPane = useRef(null);
  const detailPane = useRef(null);

  const {
    actions,
    cellActions,
    className = '',
    commonActions,
    companyId,
    component,
    configList,
    detailTitle,
    editRecord,
    editRecordHistory,
    getOrganizationSetting,
    hasTargetDate,
    hideDeleteDetailButton,
    hideNewButton,
    isShowDetail,
    isShowDetailAfterCreate,
    isShowRevisionDialog,
    isSinglePane,
    itemList,
    modeBase,
    modeHistory,
    moduleType,
    objectType,
    onClickCreateHistoryButton: propsOnClickCreateHistoryButton,
    renderDetailExtraArea,
    searchHistory,
    sfObjFieldValues,
    showCloneButton,
    title,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    value2msgkey,
    onClickUpdateHistoryButton: propsOnClickUpdateHistoryButton,
    onClickCancelEditButton: propsOnClickCancelEditButton,
    onClickCreateButton: propsOnClickCreateButton,
    onClickCreateNewButton: propsOnClickCreateNewButton,
    onClickEditButton: propsOnClickEditButton,
    onClickUpdateButton: propsOnClickUpdateButton,
    searchPsaSetting,
    hideHeaderButton,
  } = props;

  /**
   * 画面構成に必要な値をsalesforceobjectからconfigファイルを元に取得する
   */
  useEffect(() => {
    const formattedConfigList = getAllConfigList().reduce((acc, item) => {
      if (item.type === fieldType.FIELD_SELECT && !_.isNil(item.path)) {
        return [...acc, { key: item.props, path: item.path }];
      }

      return acc;
    }, []);

    if (formattedConfigList.length > 0) {
      commonActions.getSFObjFieldValues(formattedConfigList);
    }
  }, []);

  const onChangeDetailItem = (key, value, charType) => {
    commonActions.changeRecordValue(key, value, charType);
  };

  const onChangeDetailItemHistory = (key, value, charType) => {
    commonActions.changeRecordHistoryValue(
      key,
      value,
      charType,
      tmpEditRecordHistory,
      configList?.history,
      actions,
      companyId
    );
  };

  /**
   * 詳細ペイン：子（ヒストリー）データの表示を変更する
   */
  const onChangeHistory = (id) => {
    setState((state) => ({ ...state, currentHistory: id }));

    commonActions.changeHistory(
      id,
      searchHistory,
      configList,
      actions,
      companyId
    );
  };

  const onChangeHistoryTargetDate = (value) => {
    setState((state) => ({ ...state, historyTargetDate: value }));
  };

  /**
   * 詳細ペイン：親子データを新規作成保存する
   */
  const onClickSaveButton = async () => {
    const orgRecord = {
      ...editRecord,
      ...(editRecordHistory || {}),
    };
    const record = {
      ...tmpEditRecord,
      ...(tmpEditRecordHistory || {}),
    };
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const result = await commonActions.create(
      configList,
      orgRecord,
      record,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      propsOnClickCreateButton,
      isShowDetailAfterCreate
    );

    if (!result) {
      return;
    }

    onClickSearchButton(isShowDetailAfterCreate);
  };

  /**
   * 詳細ペイン：親（ベース）データを更新する
   */
  const onClickUpdateButton = async () => {
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);
    const isResetTmpRecord = !isSinglePane;

    const result = await commonActions.updateBase(
      configList,
      editRecord,
      tmpEditRecord,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      propsOnClickUpdateButton,
      isResetTmpRecord
    );

    if (!result) {
      return;
    }

    onClickSearchButton();
  };

  /**
   * 詳細ペイン：親（ベース）データを削除する
   */
  const onClickDeleteButton = async () => {
    const result = await commonActions.removeBase(
      actions,
      editRecord?.id,
      companyId
    );

    if (!result) {
      return;
    }

    onClickSearchButton();
  };

  /**
   * メイン：詳細ペインを開いてデータの新規作成を開始する
   */
  const onClickCreateNewButton = () => {
    propsOnClickCreateNewButton?.();

    commonActions.startEditingNewRecord(
      configList,
      sfObjFieldValues,
      actions,
      companyId
    );

    // @ts-ignore
    listPane.deselectRow();
  };

  const onClickCloneButton = () => {
    commonActions.startEditingClonedRecord(
      configList,
      editRecord,
      editRecordHistory
    );

    // @ts-ignore
    listPane.deselectRow();
  };

  /**
   * メイン：詳細ペインを開いてデータを表示する
   */
  const onClickEditButton = async (editRecord) => {
    await commonActions.showDetail(
      configList,
      editRecord,
      actions,
      companyId,
      propsOnClickEditButton,
      modeBase
    );

    const historyId = editRecord?.historyId;

    if (historyId) {
      setState((state) => ({ ...state, currentHistory: historyId }));
    }
  };

  /**
   * 詳細ペイン：閉じる
   */
  const onClickCancelButton = () => {
    commonActions.hideDetail();

    // @ts-ignore
    listPane.deselectRow();
  };

  /**
   * 詳細ペイン：新規作成、編集をキャンセルする
   * - 親（ベース）データの編集のキャンセル
   * - 子（ヒストリー）データの編集のキャンセル
   * - 改定ダイアログのキャンセル
   */
  const onClickCancelEditButton = () => {
    propsOnClickCancelEditButton?.();

    commonActions.cancelEditing(
      editRecord,
      editRecordHistory,
      configList,
      actions,
      companyId
    );
  };

  /**
   * メイン：検索をする
   * データを更新した際に初期化するためにも使用されている。
   */
  const onClickSearchButton = (isOpenDetail?: boolean) => {
    // @ts-ignore
    const { historyTargetDate } = state;

    commonActions.initialize(
      configList,
      sfObjFieldValues,
      actions,
      companyId,
      historyTargetDate,
      !isSinglePane,
      moduleType,
      objectType,
      isOpenDetail
    );

    if (!isSinglePane && !isOpenDetail) {
      // @ts-ignore
      listPane.deselectRow();
    }
  };

  /**
   * 詳細ペイン：親（ベース）データの編集を開始する
   */
  const onClickEditDetailButton = () => {
    onClickCancelEditButton();
    commonActions.startEditingBase();
  };

  /**
   * 詳細ペイン：改定ダイアログを開く
   */
  const onClickRevisionButton = () => {
    commonActions.showRevisionDialog();
  };

  /**
   * 改定ダイアログ：子（ヒストリー）データの編集を開始する
   */
  const onClickRevisionStartButton = ({ targetDate, comment }) => {
    commonActions.startEditingHistory(
      {
        validDateFrom: targetDate,
        comment,
      },
      tmpEditRecordHistory,
      configList?.history,
      actions,
      companyId
    );
  };

  /**
   * 詳細ペイン：子（ヒストリー）データを新規作成保存する
   */
  const onClickCreateHistoryButton = async () => {
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const history = await commonActions.appendHistory(
      configList,
      editRecordHistory,
      tmpEditRecordHistory,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      propsOnClickCreateHistoryButton
    );

    if (!history) {
      return;
    }

    setState((state) => ({
      ...state,
      currentHistory: history.id,
    }));
  };

  /**
   * 詳細ペイン：子（ヒストリー）データを更新する
   */
  const onClickUpdateHistoryButton = async () => {
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const result = await commonActions.updateHistory(
      configList,
      editRecordHistory,
      tmpEditRecordHistory,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      propsOnClickUpdateHistoryButton
    );

    if (!result) {
      return;
    }

    actions.search({ companyId });
    actions.searchHistory({ baseId: tmpEditRecord.id });
  };

  /**
   * 詳細ペイン：子（ヒストリー）データを削除する
   */
  const onClickDeleteHistoryButton = async () => {
    // @ts-ignore
    const { historyTargetDate } = state;
    const result = await commonActions.removeHistory(
      actions,
      editRecordHistory.id
    );

    if (!result) {
      return;
    }

    const param = {
      companyId,
    };

    if (historyTargetDate) {
      // @ts-ignore
      param.targetDate = historyTargetDate;
    }

    await actions.search(param);
    await actions.searchHistory({ baseId: editRecordHistory.baseId });

    const rowIdx = (itemList || []).findIndex(
      (item) => item.id === editRecordHistory.baseId
    );

    if (rowIdx > -1) {
      itemList[rowIdx].originIndex = rowIdx;
      // @ts-ignore
      listPane.onRowClick(rowIdx, itemList[rowIdx], false);
    }

    onChangeHistory(searchHistory[0].id);
  };

  const getAllConfigList = () => {
    const { base, history } = configList;
    return ConfigUtil.flatten(base, history);
  };

  const renderDoublePane = () => (
    <div className={`${ROOT} ${className || ''}`}>
      <div className={`${ROOT}-list`}>
        <ListPane
          configList={configList}
          editRecord={editRecord}
          sfObjFieldValues={sfObjFieldValues}
          getOrganizationSetting={getOrganizationSetting}
          // @ts-ignore
          historyTargetDate={state.historyTargetDate}
          itemList={itemList}
          onChangeHistoryTargetDate={onChangeHistoryTargetDate}
          onClickCreateNewButton={onClickCreateNewButton}
          onClickEditButton={onClickEditButton}
          onClickSearchButton={onClickSearchButton}
          title={title}
          tmpEditRecord={tmpEditRecord}
          value2msgkey={value2msgkey}
          useFunction={useFunction}
          ref={listPane}
          hideNewButton={hideNewButton}
          cellActions={cellActions}
          hasTargetDate={hasTargetDate}
        />
      </div>
      <ReactCSSTransitionGroup
        classNames="ts-modal-transition-slideleft"
        timeout={{ enter: 200, exit: 200 }}
      >
        <div>
          {/* FIXME: 3項演算子より良い方法がないか考える */}
          {!isShowDetail ? null : (
            <div className={`${ROOT}-detail`}>{renderDetailPane()}</div>
          )}
        </div>
      </ReactCSSTransitionGroup>
    </div>
  );

  const renderSinglePane = () => (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}-detail--single`}>{renderDetailPane()}</div>
    </div>
  );

  const renderDetailPane = () => {
    const title = (() => {
      if (modeBase !== 'new' && detailTitle) {
        return detailTitle;
      }

      if (editRecord.id !== '') {
        return msg().Com_Btn_Edit;
      }

      return msg().Com_Btn_New;
    })();

    return (
      <DetailPane
        configList={configList}
        // @ts-ignore
        currentHistory={state.currentHistory}
        editRecord={editRecord}
        editRecordHistory={editRecordHistory}
        getOrganizationSetting={getOrganizationSetting}
        isShowDialog={isShowRevisionDialog}
        isSinglePane={isSinglePane}
        modeBase={modeBase}
        modeHistory={modeHistory}
        onChangeDetailItem={onChangeDetailItem}
        onChangeDetailItemHistory={onChangeDetailItemHistory}
        onChangeHistory={onChangeHistory}
        onClickCancelButton={onClickCancelButton}
        onClickCancelEditButton={onClickCancelEditButton}
        onClickCreateHistoryButton={onClickCreateHistoryButton}
        onClickDeleteButton={!hideDeleteDetailButton && onClickDeleteButton}
        onClickDeleteHistoryButton={onClickDeleteHistoryButton}
        onClickEditDetailButton={onClickEditDetailButton}
        onClickRevisionButton={onClickRevisionButton}
        onClickRevisionStartButton={onClickRevisionStartButton}
        onClickSaveButton={onClickSaveButton}
        onClickUpdateButton={onClickUpdateButton}
        onClickUpdateHistoryButton={onClickUpdateHistoryButton}
        renderDetailExtraArea={renderDetailExtraArea}
        searchHistory={searchHistory}
        sfObjFieldValues={sfObjFieldValues}
        title={title}
        tmpEditRecord={tmpEditRecord}
        tmpEditRecordHistory={tmpEditRecordHistory}
        useFunction={useFunction}
        onClickCloneButton={onClickCloneButton}
        showCloneButton={showCloneButton}
        ref={detailPane}
        component={component}
        searchPsaSetting={searchPsaSetting}
        hideHeaderButton={hideHeaderButton}
      />
    );
  };

  return isSinglePane ? renderSinglePane() : renderDoublePane();
};
export default MainContents;
