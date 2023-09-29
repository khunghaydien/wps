import React from 'react';

import _ from 'lodash';

import masterConfigList from '../../../constants/configList/mobileSetting';
import fieldType from '../../../constants/fieldType';

import msg from '../../../../commons/languages';

import { MobileSetting } from '../../../models/mobile-setting/MobileSetting';

import { Config, ConfigList, Section } from '../../../utils/ConfigUtil';

import DetailItem from '../../../components/MainContents/DetailPane/DetailItem';
import { DetailPaneButtonsHeader } from '../../../components/MainContents/DetailPane/DetailPaneHeader';
import DetailSection from '../../../components/MainContents/DetailPane/DetailSection';

import './index.scss';

const ROOT = 'admin-pc-mobile-setting-detail-pane';

type Props = {
  mode: '' | 'edit';
  mobileSetting: MobileSetting | null;
  onClickEditButton: () => void;
  onClickCancelEditButton: () => void;
  onClickUpdateButton: () => void;
  onUpdateDetailItemValue: (key: string, value: any) => void;
  getOrganizationSetting: () => any;
};

// sectionの折りたたみとcheckboxのチェック状態はstateで管理されているのでやむをえず入れる
type State = {
  sections: Record<string, unknown>;
  checkboxes: {
    requireLocationAtMobileStamp?: boolean;
  };
};

// FIXME: SingleDetailPane共通化したい
export default class DetailPane extends React.Component<Props, State> {
  constructor() {
    // @ts-ignore
    super();
    this.state = {
      sections: {},
      checkboxes: {},
    };
    this.onClickSectionTitle = this.onClickSectionTitle.bind(this);
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.mobileSetting !== null) {
      this.setCheckBoxes(nextProps.mobileSetting, masterConfigList.base);
    }
  }

  onChangeCheckBox = (
    e: React.SyntheticEvent<HTMLInputElement>,
    key: string
  ): void => {
    const { checkboxes } = this.state;
    checkboxes[key] = e.currentTarget.checked;
    this.setState({ checkboxes });
    this.props.onUpdateDetailItemValue(key, e.currentTarget.checked);
  };

  onClickSectionTitle = (sectionKey: string): void => {
    const { sections } = this.state;
    sections[sectionKey] = !sections[sectionKey];
    this.setState({ sections });
  };

  setCheckBoxes = (editRecord: MobileSetting, configList: ConfigList): void => {
    if (configList) {
      this.setState((prevState) => {
        const checkboxes = _.cloneDeep(prevState.checkboxes);
        configList.forEach((config) => {
          if (config.section && config.configList) {
            config.configList.forEach((sectionConfigList) => {
              if (
                sectionConfigList.key &&
                sectionConfigList.type === fieldType.FIELD_CHECKBOX
              ) {
                checkboxes[sectionConfigList.key] =
                  editRecord[sectionConfigList.key] || false;
              }
            });
          } else if (config.key && config.type === fieldType.FIELD_CHECKBOX) {
            checkboxes[config.key] = editRecord[config.key] || false;
          }
        });
        return { checkboxes };
      });
    }
  };

  renderSection(config: Section) {
    const isClosed = this.state.sections[config.section] === true;
    return (
      <DetailSection
        key={config.section}
        sectionKey={config.section}
        title={msg()[config.msgkey || '']}
        description={
          config.descriptionKey ? msg()[config.descriptionKey] : null
        }
        isExpandable={config.isExpandable}
        isClosed={isClosed}
        onClickToggleButton={() => this.onClickSectionTitle(config.section)}
      >
        {this.renderItemList(config.configList || [])}
      </DetailSection>
    );
  }

  renderItem(config: Config) {
    const isEditing = this.props.mode === 'edit';
    const key = typeof config.key === 'string' ? config.key : '';

    const isDetailItemDisabled = !isEditing;
    const tmpEditRecord = this.props.mobileSetting || {};

    return (
      <DetailItem
        key={key}
        config={config}
        tmpEditRecord={tmpEditRecord}
        getOrganizationSetting={this.props.getOrganizationSetting}
        onChangeDetailItem={this.props.onUpdateDetailItemValue}
        disabled={isDetailItemDisabled}
        baseValueGetter={() => {}}
        historyValueGetter={() => {}}
        onChangeCheckBox={this.onChangeCheckBox}
        checkboxes={this.state.checkboxes}
      />
    );
  }

  renderItemList(configList: ConfigList) {
    return (
      <ul className={`${ROOT}__item-list`}>
        {configList.map((config) => {
          if (config.section) {
            return this.renderSection(config);
          } else if (config.key && config.type) {
            return this.renderItem(config);
          } else {
            return null;
          }
        })}
      </ul>
    );
  }

  render() {
    return (
      <div className={ROOT}>
        <DetailPaneButtonsHeader
          id=""
          isSinglePane
          type="top"
          mode={this.props.mode}
          title={msg().Admin_Lbl_FunctionSettings}
          onClickEditButton={this.props.onClickEditButton}
          onClickCancelButton={this.props.onClickCancelEditButton}
          onClickUpdateButton={this.props.onClickUpdateButton}
        />
        <div className={`${ROOT}__body`}>
          {this.renderItemList(masterConfigList.base)}
        </div>
      </div>
    );
  }
}
