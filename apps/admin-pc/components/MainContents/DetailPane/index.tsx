import React from 'react';

import _ from 'lodash';

import fieldType from '../../../constants/fieldType';

import Button from '../../../../commons/components/buttons/Button';
import SelectField from '../../../../commons/components/fields/SelectField';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { MODE } from '../../../modules/base/detail-pane/ui';

import * as RecordUtil from '../../../utils/RecordUtil';

import DetailPaneBody from './DetailPaneBody';
import DetailPaneHeader, { DetailPaneButtonsHeader } from './DetailPaneHeader';
import DetailSectionHeader from './DetailSectionHeader';
import HistoryDialog from './HistoryDialog';

import './index.scss';

const ROOT = 'admin-pc-contents-detail-pane';
type HeaderProps = {
  id?: string;
  modeBase?: any;
  modeHistory?: any;
  onClickUpdateBaseButton?: any;
  onClickUpdateHistoryButton?: any;
  onClickSaveNewSubRole?: () => void;
  onClickCreateHistoryButton?: any;
  title?: string;
  className?: any;
  isSinglePane?: any;
  isDisplayCloneButton?: any;
  onClickCloneButton?: any;
  onClickCloseButton?: any;
  onClickCancelButton?: any;
  onClickSaveButton?: any;
  onClickDeleteButton?: any;
  onClickEditButton?: any;
  onClickEditHistoryButton?: any;
  startAddNewSubRole?: () => void;
  onClickDeleteHistoryButton?: any;
  onClickRevisionButton?: any;
  onChangeHistory?: any;
  onChangeRole?: (string) => void;
  currentHistory?: string;
  currentRoleId?: string;
  searchHistory?: Array<any>;
  searchCompany?: Array<any>;
  allHistory?: Array<any>;
};
export const DetailPaneHeaderCtrl = (props: HeaderProps) => {
  const {
    modeBase,
    modeHistory,
    onClickUpdateBaseButton,
    onClickUpdateHistoryButton,
    onClickCreateHistoryButton,
    onClickSaveNewSubRole,
    ...newProps
  } = props;
  const mode = modeBase || modeHistory;
  const title = mode ? msg().Admin_Lbl_Editing : msg().Admin_Lbl_View;
  let onClickUpdateButton = null;

  const { EDIT, ADD_SUB_ROLE, REVISION } = MODE;
  if (modeBase === EDIT) {
    onClickUpdateButton = onClickUpdateBaseButton;
  } else if (modeHistory === EDIT) {
    onClickUpdateButton = onClickUpdateHistoryButton;
  } else if (modeHistory === REVISION) {
    onClickUpdateButton = onClickCreateHistoryButton;
  } else if (modeHistory === ADD_SUB_ROLE) {
    onClickUpdateButton = onClickSaveNewSubRole;
  }

  return (
    <DetailPaneButtonsHeader
      {...newProps}
      mode={mode}
      title={title}
      isDisplayUpdateButton
      onClickUpdateButton={onClickUpdateButton}
    />
  );
};

const createDetailPaneHeaderSub = (Component) =>
  class DetailPaneHeaderSub extends React.Component<HeaderProps> {
    isHideButtons() {
      return this.props.modeBase || this.props.modeHistory;
    }

    render() {
      return (
        <DetailPaneHeader
          title={this.props.title}
          className={this.props.className}
        >
          {!this.isHideButtons() && <Component {...this.props} />}
        </DetailPaneHeader>
      );
    }
  };

export const DetailPaneHeaderSubBase = createDetailPaneHeaderSub((props) => {
  return (
    <div>
      {!props.isSinglePane && (
        <Button
          type="destructive"
          className={`${ROOT}__base-delete`}
          onClick={props.onClickDeleteButton}
        >
          {msg().Com_Btn_Delete}
        </Button>
      )}
      <Button
        onClick={props.onClickEditButton}
        className={`${ROOT}__base-edit`}
      >
        {msg().Admin_Lbl_Edit}
      </Button>
    </div>
  );
});

const getSubRoleOptions = (allHistory, allCompanies) => {
  const subRoleKeys = [];
  let subRoleOptions = [];
  allHistory.forEach((history) => {
    const { companyId, subRoleKey, department, position } = history;
    if (subRoleKeys.indexOf(subRoleKey) < 0) {
      subRoleKeys.push(subRoleKey);
      const prefix = history.primary
        ? msg().Admin_Lbl_Primary
        : msg().Admin_Lbl_SubRole;
      const company = allCompanies.find(({ id }) => id === companyId);
      const positionText = position.name ? `- ${position.name || ''}` : '';
      const departmentText = department.name || department.code;
      const text = `${prefix} (${company.name} - ${departmentText} ${positionText})`;
      const option = { text, value: subRoleKey };
      if (subRoleKey === 'primary') {
        subRoleOptions = [option, ...subRoleOptions];
      } else {
        subRoleOptions.push(option);
      }
    }
  });

  return subRoleOptions;
};

export const DetailPaneHeaderSubHistory = createDetailPaneHeaderSub((props) => {
  let selectedNewestHistory = false;
  let disableDeleteButton = false;
  let disabledRevisionBtn = false;
  if (props.searchHistory.length > 0) {
    selectedNewestHistory = props.currentHistory === props.searchHistory[0].id;
    disableDeleteButton =
      !selectedNewestHistory || props.searchHistory.length === 1;
    if (props.currentRoleId) {
      // emp screen
      disableDeleteButton =
        !selectedNewestHistory ||
        (props.currentRoleId === 'primary' && props.searchHistory.length === 1);
      disabledRevisionBtn = !selectedNewestHistory;
    }
  } else {
    disableDeleteButton = true;
  }

  let historyList = null;

  if (props.id !== '') {
    const options =
      props.modeHistory === 'revision'
        ? []
        : props.searchHistory.map((history) => ({
            text:
              DateUtil.customFormat(
                history.resignationDate || history.validDateFrom, // for employee history, display its resignation date
                'L'
              ) || '',
            value: history.id,
          }));

    const disabled = props.modeHistory !== '';

    historyList = (
      <div className={`${ROOT}__history-select_wrapper`}>
        <div
          className={`${ROOT}__history-select_title`}
          style={{ display: 'inline-block' }}
        >
          {msg().Admin_Lbl_Selected}：
        </div>
        <SelectField
          className={`${ROOT}__history-select`}
          onChange={(e) => {
            props.onChangeHistory(e.target.value);
          }}
          options={options}
          value={props.currentHistory}
          disabled={disabled}
        />
      </div>
    );
  }

  const subRoleArea = props.currentRoleId ? (
    <div className={`${ROOT}__sub-role`}>
      <SelectField
        className={`${ROOT}__sub-role-select`}
        onChange={(e) => {
          props.onChangeRole(e.target.value);
        }}
        options={getSubRoleOptions(props.allHistory, props.searchCompany)}
        value={props.currentRoleId}
        // disabled={disabled}
      />

      <Button onClick={props.startAddNewSubRole}>
        {msg().Admin_Btn_AddSubRole}
      </Button>
    </div>
  ) : null;

  return (
    <div>
      {subRoleArea}
      {historyList}
      <Button
        type="destructive"
        disabled={disableDeleteButton}
        onClick={props.onClickDeleteHistoryButton}
      >
        {msg().Com_Btn_Delete}
      </Button>

      {props.onClickEditHistoryButton && (
        <Button onClick={props.onClickEditHistoryButton}>
          {msg().Admin_Lbl_Edit}
        </Button>
      )}

      <Button
        onClick={props.onClickRevisionButton}
        disabled={disabledRevisionBtn}
      >
        {msg().Admin_Lbl_Revision}
      </Button>
    </div>
  );
});

type Props = {
  configList?: any;
  currentHistory?: string;
  currentRoleId?: string;
  editRecord?: any;
  editRecordHistory?: any;
  getOrganizationSetting?: any;
  isSinglePane?: boolean;
  isShowDialog?: boolean;
  onChangeDetailItem?: any;
  onChangeDetailItemHistory?: Function;
  onChangeHistory?: any;
  onChangeRole?: (string) => void;
  onClickCancelButton?: any;
  onClickCancelEditButton?: any;
  onClickEditDetailButton?: Function;
  onClickCloneButton?: Function;
  onClickRevisionButton?: any;
  onClickDeleteButton?: any;
  onClickDeleteHistoryButton?: any;
  onClickSaveButton?: Function;
  onClickCreateHistoryButton?: Function;
  onClickSaveNewSubRole?: () => void;
  onClickEditHistoryButton?: Function;
  onClickUpdateButton?: Function;
  onClickUpdateHistoryButton?: Function;
  onClickRevisionStartButton?: any;
  startAddNewSubRole?: () => void;
  searchHistory?: Array<any>;
  allHistory?: Array<any>;
  searchCompany?: Array<any>;
  sfObjFieldValues?: any;
  tmpEditRecord?: any;
  tmpEditRecordHistory?: any;
  modeBase?: string;
  modeHistory?: string;
  renderDetailExtraArea?: any;
  title?: string;
  useFunction?: any;
  showCloneButton?: boolean;
  baseValueGetter?: any;
  historyValueGetter?: any;
  component?: React.ReactNode;
};

export default class DetailPane extends React.Component<Props> {
  static defaultProps = {
    title: '',
    renderDetailExtraArea: null,
  };

  constructor(props) {
    super(props);
    this.state = { checkboxes: {} };
    // @ts-ignore
    this.baseValueGetter = this.getBaseValue.bind(this);
    // @ts-ignore
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  onChangeCheckBox(e, key) {
    const isChecked = e.target.checked;
    this.setState((prevState) => {
      // @ts-ignore
      const checkboxes = prevState.checkboxes;
      checkboxes[key] = isChecked;
      return { checkboxes };
    });
    this.props.onChangeDetailItem(key, e.target.checked);
  }

  onChangeCheckBoxHistory(e, key) {
    const isChecked = e.target.checked;
    this.setState((prevState) => {
      // @ts-ignore
      const checkboxes = prevState.checkboxes;
      checkboxes[key] = isChecked;
      return { checkboxes };
    });
    this.props.onChangeDetailItemHistory(key, e.target.checked);
  }

  onClickCancelEditButton() {
    this.setCheckBoxes(this.props.editRecord, this.props.configList.base);
    this.setCheckBoxes(
      this.props.editRecordHistory,
      this.props.configList.history
    );
    this.props.onClickCancelEditButton();
  }

  getBaseValue(key) {
    return RecordUtil.getter(this.props.tmpEditRecord)(key);
  }

  getHistoryValue(key) {
    return RecordUtil.getter(this.props.tmpEditRecordHistory)(key);
  }

  setCheckBoxes(editRecord, configList) {
    if (configList) {
      this.setState((prevState) => {
        // @ts-ignore
        const checkboxes = _.cloneDeep(prevState.checkboxes);

        const evalConfigTree = (targetConfigList) => {
          targetConfigList.forEach((config) => {
            if (config.section) {
              evalConfigTree(config.configList);
            } else if (config.type === fieldType.FIELD_CHECKBOX) {
              checkboxes[config.key] = editRecord[config.key] || false;
            }
          });
        };
        evalConfigTree(configList);

        return { checkboxes };
      });
    }
  }

  renderRevisionList() {
    if (this.props.searchHistory.length < 1) {
      return null;
    }

    return (
      <>
        <DetailSectionHeader className={`${ROOT}__revision-header`}>
          {msg().Admin_Lbl_RevisionHistory}
        </DetailSectionHeader>
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
              <li key={history.id} className={`${ROOT}__revision-item`}>
                <div className={`${ROOT}__revision-item__date`}>
                  {DateUtil.customFormat(
                    history.resignationDate || history.validDateFrom, // for employee history, display its resignation date
                    'L'
                  )}
                </div>
                <div className={`${ROOT}__revision-item__comment`}>
                  {history.comment}
                </div>
              </li>
            );
          })}
        </ul>
      </>
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
          onClickEditHistoryButton={this.props.onClickEditHistoryButton}
          startAddNewSubRole={this.props.startAddNewSubRole}
          onChangeHistory={this.props.onChangeHistory}
          onChangeRole={this.props.onChangeRole}
          currentHistory={this.props.currentHistory}
          currentRoleId={this.props.currentRoleId}
          searchHistory={this.props.searchHistory}
          searchCompany={this.props.searchCompany}
          allHistory={this.props.allHistory}
          title={msg().Admin_Lbl_HistoryProperties}
          // @ts-ignore
          className={[
            `${ROOT}__header-sub`,
            this.props.currentRoleId ? `${ROOT}__header-sub-with-role` : '',
          ]}
        />
        {/* @ts-ignore */}
        <DetailPaneBody
          // @ts-ignore
          checkboxes={this.state.checkboxes}
          configList={this.props.configList.history}
          // @ts-ignore
          baseValueGetter={this.baseValueGetter}
          // @ts-ignore
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
          component={this.props.modeBase !== 'new' && this.props.component}
        />
        {this.renderRevisionList()}
      </div>
    );
  }

  render() {
    const title = this.props.configList.history ? msg().Admin_Lbl_Base : '';
    return (
      <div className={ROOT}>
        {this.props.configList.history ? (
          /*
           * このヘッダーバーのボタンの左端マージンが
           * 他のヘッダーバーのボタンと同一でないという既知の問題があります。
           * しかし、スクロールバーの幅によるズレなので、
           * OS、ブラウザ、スクロールバーが無い場合で変化してしまいます。
           * 対応が難しいので対応不要ということにしております。
           */
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
            onClickSaveNewSubRole={this.props.onClickSaveNewSubRole}
            onClickUpdateHistoryButton={this.props.onClickUpdateHistoryButton}
          />
        ) : (
          <DetailPaneButtonsHeader
            isSinglePane={this.props.isSinglePane}
            mode={this.props.modeBase}
            title={this.props.title || title}
            isDisplayCloneButton={this.props.showCloneButton}
            onClickCloneButton={this.props.onClickCloneButton}
            onClickDeleteButton={this.props.onClickDeleteButton}
            onClickEditButton={this.props.onClickEditDetailButton}
            onClickCloseButton={this.props.onClickCancelButton}
            onClickCancelButton={this.onClickCancelEditButton}
            onClickSaveButton={this.props.onClickSaveButton}
            onClickUpdateButton={this.props.onClickUpdateButton}
            onClickUpdateHistoryButton={this.props.onClickUpdateHistoryButton}
          />
        )}
        <div className={`${ROOT}__scrollable`}>
          {this.props.configList.history && (
            <DetailPaneHeaderSubBase
              isSinglePane={this.props.isSinglePane}
              modeBase={this.props.modeBase}
              modeHistory={this.props.modeHistory}
              onClickDeleteButton={this.props.onClickDeleteButton}
              onClickEditButton={this.props.onClickEditDetailButton}
              // @ts-ignore
              className={[`${ROOT}__header-sub`]}
              title={msg().Admin_Lbl_BaseInfo}
            />
          )}
          {/* @ts-ignore */}
          <DetailPaneBody
            mode={this.props.modeBase}
            // @ts-ignore
            checkboxes={this.state.checkboxes}
            configList={this.props.configList.base}
            // @ts-ignore
            baseValueGetter={this.baseValueGetter}
            // @ts-ignore
            historyValueGetter={this.historyValueGetter}
            disabled={!this.props.modeBase}
            getOrganizationSetting={this.props.getOrganizationSetting}
            onChangeCheckBox={this.onChangeCheckBox}
            onChangeDetailItem={this.props.onChangeDetailItem}
            sfObjFieldValues={this.props.sfObjFieldValues}
            tmpEditRecord={this.props.tmpEditRecord}
            renderDetailExtraArea={this.props.renderDetailExtraArea}
            useFunction={this.props.useFunction}
            component={this.props.modeBase !== 'new' && this.props.component}
          />
          {this.renderHistoryArea()}
          {this.renderHistoryDialog()}
        </div>
      </div>
    );
  }
}
