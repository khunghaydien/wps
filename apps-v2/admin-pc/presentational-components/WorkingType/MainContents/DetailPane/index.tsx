import * as React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import fieldType from '../../../../constants/fieldType';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';

import { ConfigList, ConfigListMap } from '../../../../utils/ConfigUtil';
import * as RecordUtil from '../../../../utils/RecordUtil';

import {
  DetailPaneHeaderCtrl,
  DetailPaneHeaderSubBase,
  DetailPaneHeaderSubHistory,
} from '../../../../components/MainContents/DetailPane';
import DetailPaneBody from '../../../../components/MainContents/DetailPane/DetailPaneBody';
import HistoryDialog from '../../../../components/MainContents/DetailPane/HistoryDialog';

import './index.scss';

const ROOT = 'admin-pc-contents-detail-pane';

type Props = {
  configList: ConfigListMap;
  currentHistory: string;
  editRecord: RecordUtil.Record;
  editRecordHistory: RecordUtil.Record;
  getOrganizationSetting: Record<string, unknown>;
  isSinglePane: boolean;
  isShowDialog: boolean;
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
  onClickCloneButton: () => void;
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
  renderDetailExtraArea: () => void;
  useFunction: Record<string, unknown>;
  showCloneButton: boolean;
};

type State = {
  checkboxes: Record<string, unknown>;
};

export default class DetailPane extends React.Component<Props, State> {
  state: State;
  baseValueGetter: any;
  historyValueGetter: any;

  static defaultProps = {
    renderDetailExtraArea: null,
  };

  constructor(props: Props) {
    super(props);
    this.state = { checkboxes: {} };
    this.baseValueGetter = this.getBaseValue.bind(this);
    this.historyValueGetter = this.getHistoryValue.bind(this);
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    this.onChangeCheckBoxHistory = this.onChangeCheckBoxHistory.bind(this);
    this.onClickCancelEditButton = this.onClickCancelEditButton.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setCheckBoxes(this.props.editRecord, this.props.configList.base);
    this.setCheckBoxes(
      this.props.editRecordHistory,
      this.props.configList.history
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.editRecord.id !== nextProps.editRecord.id) {
      this.setCheckBoxes(nextProps.editRecord, nextProps.configList.base);
    }
    if (
      this.props.editRecordHistory &&
      this.props.editRecordHistory.id !== nextProps.editRecordHistory.id
    ) {
      this.setCheckBoxes(
        nextProps.editRecordHistory,
        nextProps.configList.history
      );
    }
  }

  onChangeCheckBox(e: React.SyntheticEvent<HTMLInputElement>, key: string) {
    const isChecked = e.currentTarget.checked;
    this.setState((prevState) => {
      const checkboxes = prevState.checkboxes;
      checkboxes[key] = isChecked;
      return { checkboxes };
    });
    this.props.onChangeDetailItem(key, e.currentTarget.checked);
  }

  onChangeCheckBoxHistory(
    e: React.SyntheticEvent<HTMLInputElement>,
    key: string
  ) {
    const isChecked = e.currentTarget.checked;
    this.setState((prevState) => {
      const checkboxes = prevState.checkboxes;
      checkboxes[key] = isChecked;
      return { checkboxes };
    });
    this.props.onChangeDetailItemHistory(key, e.currentTarget.checked);
  }

  onClickCancelEditButton() {
    this.setCheckBoxes(this.props.editRecord, this.props.configList.base);
    this.setCheckBoxes(
      this.props.editRecordHistory,
      this.props.configList.history
    );
    this.props.onClickCancelEditButton();
  }

  getBaseValue(key: string) {
    return RecordUtil.getter(this.props.tmpEditRecord)(key);
  }

  getHistoryValue(key: string) {
    return RecordUtil.getter(this.props.tmpEditRecordHistory)(key);
  }

  setCheckBoxes(editRecord: RecordUtil.Record, configList?: ConfigList) {
    if (configList) {
      this.setState((prevState) => {
        const checkboxes = cloneDeep(prevState.checkboxes);

        const evalConfigTree = (targetConfigList: ConfigList) => {
          targetConfigList.forEach((config) => {
            if (config.section && config.configList) {
              evalConfigTree(config.configList);
            } else if (config.type === fieldType.FIELD_CHECKBOX && config.key) {
              checkboxes[config.key] = editRecord[config.key] || false;
            }
          });
        };
        evalConfigTree(configList);

        return { checkboxes };
      });
    }
  }

  renderHr() {
    if (this.props.searchHistory.length < 1) {
      return null;
    }
    return <hr className={`${ROOT}__hr`} />;
  }

  renderRevisionList() {
    if (this.props.searchHistory.length < 1) {
      return null;
    }

    return (
      <ul className={`${ROOT}__revision`}>
        <li className={`${ROOT}__revision-title`}>
          <div className={`${ROOT}__revision-title__date`}>
            {msg().Admin_Lbl_RevisionDate}
          </div>
          <div className={`${ROOT}__revision-title__comment`}>
            {msg().Admin_Lbl_ReasonForRevision}
          </div>
        </li>
        {this.props.searchHistory.map((history) => {
          return (
            // @ts-ignore
            <li key={history.id} className={`${ROOT}__revision-item`}>
              <div className={`${ROOT}__revision-item__date`}>
                {/* @ts-ignore */}
                {DateUtil.customFormat(history.validDateFrom, 'L')}
              </div>
              <div className={`${ROOT}__revision-item__comment`}>
                {/* @ts-ignore */}
                {history.comment}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  renderHistoryDialog() {
    if (!this.props.isShowDialog) {
      return null;
    }

    return (
      <HistoryDialog
        onClickCancelButton={this.props.onClickCancelEditButton}
        onClickSaveButton={this.props.onClickRevisionStartButton}
        title={msg().Admin_Lbl_Revision}
      />
    );
  }

  renderHistoryArea() {
    if (!this.props.configList.history) {
      return null;
    }

    return (
      <div>
        <DetailPaneHeaderSubHistory
          id={this.props.editRecord.id}
          modeBase={this.props.modeBase}
          modeHistory={this.props.modeHistory}
          onClickDeleteHistoryButton={this.props.onClickDeleteHistoryButton}
          onClickRevisionButton={this.props.onClickRevisionButton}
          onChangeHistory={this.props.onChangeHistory}
          currentHistory={this.props.currentHistory}
          searchHistory={this.props.searchHistory}
          title={msg().Admin_Lbl_HistoryProperties}
          className={[`${ROOT}__header-sub`]}
        />
        <DetailPaneBody
          checkboxes={this.state.checkboxes}
          configList={this.props.configList.history}
          baseValueGetter={this.baseValueGetter}
          historyValueGetter={this.historyValueGetter}
          disabled={this.props.modeHistory === ''}
          mode={this.props.modeHistory}
          getOrganizationSetting={this.props.getOrganizationSetting}
          onChangeCheckBox={this.onChangeCheckBoxHistory}
          onChangeDetailItem={this.props.onChangeDetailItemHistory}
          sfObjFieldValues={this.props.sfObjFieldValues}
          tmpEditRecord={this.props.tmpEditRecordHistory}
          tmpEditRecordBase={this.props.tmpEditRecord}
          useFunction={this.props.useFunction}
        />
        {this.renderHr()}
        {this.renderRevisionList()}
      </div>
    );
  }

  render() {
    return (
      <div className={ROOT}>
        <DetailPaneHeaderCtrl
          isSinglePane={this.props.isSinglePane}
          modeBase={this.props.modeBase}
          modeHistory={this.props.modeHistory}
          isDisplayCloneButton={this.props.showCloneButton}
          onClickCloneButton={this.props.onClickCloneButton}
          onClickCloseButton={this.props.onClickCancelButton}
          onClickCancelButton={this.onClickCancelEditButton}
          onClickSaveButton={this.props.onClickSaveButton}
          onClickUpdateBaseButton={this.props.onClickUpdateButton}
          onClickCreateHistoryButton={this.props.onClickCreateHistoryButton}
          onClickUpdateHistoryButton={this.props.onClickUpdateHistoryButton}
        />
        <div className={`${ROOT}__scrollable`}>
          <DetailPaneHeaderSubBase
            isSinglePane={this.props.isSinglePane}
            modeBase={this.props.modeBase}
            modeHistory={this.props.modeHistory}
            onClickDeleteButton={this.props.onClickDeleteButton}
            onClickEditButton={this.props.onClickEditDetailButton}
            className={[`${ROOT}__header-sub`]}
            title={msg().Admin_Lbl_BaseInfo}
          />
          <DetailPaneBody
            mode={this.props.modeBase}
            checkboxes={this.state.checkboxes}
            configList={this.props.configList.base}
            baseValueGetter={this.baseValueGetter}
            historyValueGetter={this.historyValueGetter}
            disabled={!this.props.modeBase}
            getOrganizationSetting={this.props.getOrganizationSetting}
            onChangeCheckBox={this.onChangeCheckBox}
            onChangeDetailItem={this.props.onChangeDetailItem}
            sfObjFieldValues={this.props.sfObjFieldValues}
            tmpEditRecord={this.props.tmpEditRecord}
            renderDetailExtraArea={this.props.renderDetailExtraArea}
            useFunction={this.props.useFunction}
          />
          {this.renderHistoryArea()}
          {this.renderHistoryDialog()}
        </div>
      </div>
    );
  }
}
