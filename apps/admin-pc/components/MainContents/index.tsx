import React from 'react';
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
};
/**
 * 設定画面の基礎クラス
 */
export default class MainContents extends React.Component<Props> {
  static defaultProps = {
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
  };

  constructor(props) {
    super(props);
    this.state = {
      currentHistory: '',
      historyTargetDate: '',
    };
    this.onChangeDetailItem = this.onChangeDetailItem.bind(this);
    this.onChangeDetailItemHistory = this.onChangeDetailItemHistory.bind(this);
    this.onChangeHistory = this.onChangeHistory.bind(this);
    this.onChangeHistoryTargetDate = this.onChangeHistoryTargetDate.bind(this);
    this.onClickCancelButton = this.onClickCancelButton.bind(this);
    this.onClickCancelEditButton = this.onClickCancelEditButton.bind(this);
    this.onClickCreateHistoryButton =
      this.onClickCreateHistoryButton.bind(this);
    this.onClickCreateNewButton = this.onClickCreateNewButton.bind(this);
    this.onClickDeleteButton = this.onClickDeleteButton.bind(this);
    this.onClickDeleteHistoryButton =
      this.onClickDeleteHistoryButton.bind(this);
    this.onClickEditButton = this.onClickEditButton.bind(this);
    this.onClickEditDetailButton = this.onClickEditDetailButton.bind(this);
    this.onClickRevisionButton = this.onClickRevisionButton.bind(this);
    this.onClickRevisionStartButton =
      this.onClickRevisionStartButton.bind(this);
    this.onClickSaveButton = this.onClickSaveButton.bind(this);
    this.onClickSearchButton = this.onClickSearchButton.bind(this);
    this.onClickCloneButton = this.onClickCloneButton.bind(this);
    this.onClickUpdateButton = this.onClickUpdateButton.bind(this);
    this.onClickUpdateHistoryButton =
      this.onClickUpdateHistoryButton.bind(this);
  }

  /**
   * 画面構成に必要な値をsalesforceobjectからconfigファイルを元に取得する
   */
  UNSAFE_componentWillMount() {
    const param = this.getAllConfigList()
      .filter((item) => {
        return item.type === fieldType.FIELD_SELECT && !_.isNil(item.path);
      })
      .map((item) => {
        return { key: item.props, path: item.path };
      });
    if (param.length > 0) {
      this.props.commonActions.getSFObjFieldValues(param);
    }
  }

  onChangeDetailItem(key, value, charType) {
    this.props.commonActions.changeRecordValue(key, value, charType);
  }

  onChangeDetailItemHistory(key, value, charType) {
    this.props.commonActions.changeRecordHistoryValue(
      key,
      value,
      charType,
      this.props.tmpEditRecordHistory,
      this.props.configList.history,
      this.props.actions,
      this.props.companyId
    );
  }

  /**
   * 詳細ペイン：子（ヒストリー）データの表示を変更する
   */
  onChangeHistory(id) {
    this.setState({ currentHistory: id });
    this.props.commonActions.changeHistory(
      id,
      this.props.searchHistory,
      this.props.configList,
      this.props.actions,
      this.props.companyId
    );
  }

  onChangeHistoryTargetDate(value) {
    this.setState({ historyTargetDate: value });
  }

  /**
   * 詳細ペイン：親子データを新規作成保存する
   */
  async onClickSaveButton() {
    const {
      configList,
      editRecord,
      editRecordHistory,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      actions,
      companyId,
      onClickCreateButton,
      isShowDetailAfterCreate,
    } = this.props;

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

    const result = await this.props.commonActions.create(
      configList,
      orgRecord,
      record,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      onClickCreateButton,
      isShowDetailAfterCreate
    );

    if (!result) {
      return;
    }

    this.onClickSearchButton(isShowDetailAfterCreate);
  }

  /**
   * 詳細ペイン：親（ベース）データを更新する
   */
  async onClickUpdateButton() {
    const {
      configList,
      editRecord,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      actions,
      companyId,
      onClickUpdateButton,
      isSinglePane,
    } = this.props;
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);
    const isResetTmpRecord = !isSinglePane;
    const result = await this.props.commonActions.updateBase(
      configList,
      editRecord,
      tmpEditRecord,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      onClickUpdateButton,
      isResetTmpRecord
    );

    if (!result) {
      return;
    }

    this.onClickSearchButton();
  }

  /**
   * 詳細ペイン：親（ベース）データを削除する
   */
  async onClickDeleteButton() {
    const { actions, editRecord, companyId } = this.props;

    const result = await this.props.commonActions.removeBase(
      actions,
      editRecord.id,
      companyId
    );

    if (!result) {
      return;
    }

    this.onClickSearchButton();
  }

  /**
   * メイン：詳細ペインを開いてデータの新規作成を開始する
   */
  onClickCreateNewButton() {
    if (this.props.onClickCreateNewButton) {
      this.props.onClickCreateNewButton();
    }

    const { configList, sfObjFieldValues, actions, companyId } = this.props;
    this.props.commonActions.startEditingNewRecord(
      configList,
      sfObjFieldValues,
      actions,
      companyId
    );

    // @ts-ignore
    this.listPane.deselectRow();
  }

  onClickCloneButton() {
    const { configList, editRecord, editRecordHistory } = this.props;
    this.props.commonActions.startEditingClonedRecord(
      configList,
      editRecord,
      editRecordHistory
    );
    // @ts-ignore
    this.listPane.deselectRow();
  }

  /**
   * メイン：詳細ペインを開いてデータを表示する
   */
  async onClickEditButton(editRecord) {
    const { configList, actions, companyId, onClickEditButton, modeBase } =
      this.props;

    await this.props.commonActions.showDetail(
      configList,
      editRecord,
      actions,
      companyId,
      onClickEditButton,
      modeBase
    );

    const historyId = editRecord.historyId;

    if (historyId) {
      this.setState({ currentHistory: historyId });
    }
  }

  /**
   * 詳細ペイン：閉じる
   */
  onClickCancelButton() {
    this.props.commonActions.hideDetail();
    // @ts-ignore
    this.listPane.deselectRow();
  }

  /**
   * 詳細ペイン：新規作成、編集をキャンセルする
   * - 親（ベース）データの編集のキャンセル
   * - 子（ヒストリー）データの編集のキャンセル
   * - 改定ダイアログのキャンセル
   */
  onClickCancelEditButton() {
    if (this.props.onClickCancelEditButton) {
      this.props.onClickCancelEditButton();
    }
    this.props.commonActions.cancelEditing(
      this.props.editRecord,
      this.props.editRecordHistory,
      this.props.configList,
      this.props.actions,
      this.props.companyId
    );
  }

  /**
   * メイン：検索をする
   * データを更新した際に初期化するためにも使用されている。
   */
  onClickSearchButton(isDetailOpen?: boolean) {
    const { isSinglePane, moduleType, objectType } = this.props;
    // @ts-ignore
    const { historyTargetDate } = this.state;

    this.props.commonActions.initialize(
      this.props.configList,
      this.props.sfObjFieldValues,
      this.props.actions,
      this.props.companyId,
      historyTargetDate,
      !isSinglePane,
      moduleType,
      objectType,
      isDetailOpen
    );

    if (!isSinglePane && !isDetailOpen) {
      // @ts-ignore
      this.listPane.deselectRow();
    }
  }

  /**
   * 詳細ペイン：親（ベース）データの編集を開始する
   */
  onClickEditDetailButton() {
    this.onClickCancelEditButton();
    this.props.commonActions.startEditingBase();
  }

  /**
   * 詳細ペイン：改定ダイアログを開く
   */
  onClickRevisionButton() {
    this.props.commonActions.showRevisionDialog();
  }

  /**
   * 改定ダイアログ：子（ヒストリー）データの編集を開始する
   */
  onClickRevisionStartButton({ targetDate, comment }) {
    this.props.commonActions.startEditingHistory(
      {
        validDateFrom: targetDate,
        comment,
      },
      this.props.tmpEditRecordHistory,
      this.props.configList.history,
      this.props.actions,
      this.props.companyId
    );
  }

  /**
   * 詳細ペイン：子（ヒストリー）データを新規作成保存する
   */
  async onClickCreateHistoryButton() {
    const {
      configList,
      editRecordHistory,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      actions,
      companyId,
      onClickCreateHistoryButton,
    } = this.props;
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const history = await this.props.commonActions.appendHistory(
      configList,
      editRecordHistory,
      tmpEditRecordHistory,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      onClickCreateHistoryButton
    );

    if (!history) {
      return;
    }

    this.setState({
      currentHistory: history.id,
    });
  }

  /**
   * 詳細ペイン：子（ヒストリー）データを更新する
   */
  async onClickUpdateHistoryButton() {
    const {
      configList,
      editRecordHistory,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      actions,
      companyId,
      onClickUpdateHistoryButton,
    } = this.props;
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const result = await this.props.commonActions.updateHistory(
      configList,
      editRecordHistory,
      tmpEditRecordHistory,
      useFunction,
      baseValueGetter,
      historyValueGetter,
      actions,
      companyId,
      onClickUpdateHistoryButton
    );

    if (!result) {
      return;
    }

    this.props.actions.search({ companyId });
    this.props.actions.searchHistory({ baseId: tmpEditRecord.id });
  }

  /**
   * 詳細ペイン：子（ヒストリー）データを削除する
   */
  async onClickDeleteHistoryButton() {
    const { editRecordHistory, actions, companyId } = this.props;
    // @ts-ignore
    const { historyTargetDate } = this.state;
    const result = await this.props.commonActions.removeHistory(
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

    const { itemList, searchHistory } = this.props;

    const rowIdx = (itemList || []).findIndex(
      (item) => item.id === editRecordHistory.baseId
    );

    if (rowIdx > -1) {
      this.props.itemList[rowIdx].originIndex = rowIdx;
      // @ts-ignore
      this.listPane.onRowClick(rowIdx, this.props.itemList[rowIdx], false);
    }

    this.onChangeHistory(searchHistory[0].id);
  }

  getAllConfigList() {
    const { base, history } = this.props.configList;
    return ConfigUtil.flatten(base, history);
  }

  renderDoublePane() {
    const { className = '' } = this.props;

    return (
      <div className={`${ROOT} ${className || ''}`}>
        <div className={`${ROOT}-list`}>
          <ListPane
            configList={this.props.configList}
            editRecord={this.props.editRecord}
            getOrganizationSetting={this.props.getOrganizationSetting}
            // @ts-ignore
            historyTargetDate={this.state.historyTargetDate}
            itemList={this.props.itemList}
            onChangeHistoryTargetDate={this.onChangeHistoryTargetDate}
            onClickCreateNewButton={this.onClickCreateNewButton}
            onClickEditButton={this.onClickEditButton}
            onClickSearchButton={this.onClickSearchButton}
            title={this.props.title}
            tmpEditRecord={this.props.tmpEditRecord}
            value2msgkey={this.props.value2msgkey}
            useFunction={this.props.useFunction}
            ref={(ref) => {
              // @ts-ignore
              this.listPane = ref;
            }}
            hideNewButton={this.props.hideNewButton}
            cellActions={this.props.cellActions}
          />
        </div>
        <ReactCSSTransitionGroup
          classNames="ts-modal-transition-slideleft"
          timeout={{ enter: 200, exit: 200 }}
        >
          <div>
            {/* FIXME: 3項演算子より良い方法がないか考える */}
            {!this.props.isShowDetail ? null : (
              <div className={`${ROOT}-detail`}>{this.renderDetailPane()}</div>
            )}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  renderSinglePane() {
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}-detail--single`}>
          {this.renderDetailPane()}
        </div>
      </div>
    );
  }

  renderDetailPane() {
    let title =
      this.props.editRecord.id !== '' ? msg().Com_Btn_Edit : msg().Com_Btn_New;
    title =
      this.props.modeBase !== 'new' && this.props.detailTitle
        ? this.props.detailTitle
        : title;
    return (
      <DetailPane
        configList={this.props.configList}
        // @ts-ignore
        currentHistory={this.state.currentHistory}
        editRecord={this.props.editRecord}
        editRecordHistory={this.props.editRecordHistory}
        getOrganizationSetting={this.props.getOrganizationSetting}
        isShowDialog={this.props.isShowRevisionDialog}
        isSinglePane={this.props.isSinglePane}
        modeBase={this.props.modeBase}
        modeHistory={this.props.modeHistory}
        onChangeDetailItem={this.onChangeDetailItem}
        onChangeDetailItemHistory={this.onChangeDetailItemHistory}
        onChangeHistory={this.onChangeHistory}
        onClickCancelButton={this.onClickCancelButton}
        onClickCancelEditButton={this.onClickCancelEditButton}
        onClickCreateHistoryButton={this.onClickCreateHistoryButton}
        onClickDeleteButton={
          !this.props.hideDeleteDetailButton && this.onClickDeleteButton
        }
        onClickDeleteHistoryButton={this.onClickDeleteHistoryButton}
        onClickEditDetailButton={this.onClickEditDetailButton}
        onClickRevisionButton={this.onClickRevisionButton}
        onClickRevisionStartButton={this.onClickRevisionStartButton}
        onClickSaveButton={this.onClickSaveButton}
        onClickUpdateButton={this.onClickUpdateButton}
        onClickUpdateHistoryButton={this.onClickUpdateHistoryButton}
        renderDetailExtraArea={this.props.renderDetailExtraArea}
        searchHistory={this.props.searchHistory}
        sfObjFieldValues={this.props.sfObjFieldValues}
        title={this.props.isSinglePane ? this.props.title : title}
        tmpEditRecord={this.props.tmpEditRecord}
        tmpEditRecordHistory={this.props.tmpEditRecordHistory}
        useFunction={this.props.useFunction}
        onClickCloneButton={this.onClickCloneButton}
        showCloneButton={this.props.showCloneButton}
        ref={(ref) => {
          // @ts-ignore
          this.detailPane = ref;
        }}
        component={this.props.component}
      />
    );
  }

  render() {
    return this.props.isSinglePane
      ? this.renderSinglePane()
      : this.renderDoublePane();
  }
}
