import React from 'react';

import _ from 'lodash';

import masterConfigList from '../../../constants/configList/plannerSetting';
import fieldType from '../../../constants/fieldType';

import Label from '../../../../commons/components/fields/Label';
import msg from '../../../../commons/languages';

import { PlannerSetting } from '../../../models/planner-setting/PlannerSetting';

import DetailItem from '../../../components/MainContents/DetailPane/DetailItem';
import { DetailPaneButtonsHeader } from '../../../components/MainContents/DetailPane/DetailPaneHeader';
import DetailSection from '../../../components/MainContents/DetailPane/DetailSection';

import AuthStatusField from './AuthStatusField';

import './index.scss';

const ROOT = 'admin-pc-planner-setting-detail-pane';

type Props = {
  mode: '' | 'edit';
  plannerSetting: PlannerSetting | null;
  onClickEditButton: () => void;
  onClickCancelEditButton: () => void;
  onClickUpdateButton: () => void;
  onClickAuthButton: () => void;
  onClickRemoteSiteSettingButton: () => void;
  onUpdateDetailItemValue: (key: string, value: any) => void;
  getOrganizationSetting: () => any;
};

type State = {
  sections: {
    [key: string]: boolean;
  };
  checkboxes: {
    [key: string]: boolean;
  };
};

export default class DetailPane extends React.Component<Props, State> {
  constructor() {
    // @ts-ignore
    super();
    this.state = {
      sections: {
        calendarAccess: true,
      },
      checkboxes: {},
    };
    this.onClickSectionTitle = this.onClickSectionTitle.bind(this);
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.plannerSetting !== null) {
      this.setCheckBoxes(nextProps.plannerSetting, masterConfigList.base);
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

  setCheckBoxes = (editRecord: PlannerSetting, configList: any[]): void => {
    if (configList) {
      this.setState((prevState) => {
        const checkboxes = _.cloneDeep(prevState.checkboxes);
        configList.forEach((config) => {
          if (config.section) {
            config.configList.forEach((sectionConfigList) => {
              if (sectionConfigList.type === fieldType.FIELD_CHECKBOX) {
                checkboxes[sectionConfigList.key] =
                  editRecord[sectionConfigList.key] || false;
              }
            });
          } else if (config.type === fieldType.FIELD_CHECKBOX) {
            checkboxes[config.key] = editRecord[config.key] || false;
          }
        });
        return { checkboxes };
      });
    }
  };

  renderSection(config: any) {
    const isClosed = this.state.sections[config.section] === true;
    return (
      <DetailSection
        key={config.section}
        sectionKey={config.section}
        title={msg()[config.msgkey]}
        description={
          config.descriptionKey ? msg()[config.descriptionKey] : null
        }
        isExpandable={config.isExpandable}
        isClosed={isClosed}
        onClickToggleButton={() => this.onClickSectionTitle(config.section)}
      >
        {this.renderItemList(config.configList)}
      </DetailSection>
    );
  }

  renderItem(config: { key: any; msgkey: any }) {
    const isEditing = this.props.mode === 'edit';
    const key = typeof config.key === 'string' ? config.key : '';

    if (key === 'authStatus') {
      const isCalendarEnabled =
        (this.props.plannerSetting &&
          this.props.plannerSetting.useCalendarAccess) ||
        false;

      if (isCalendarEnabled) {
        const msgkey = typeof config.msgkey === 'string' ? config.msgkey : '';
        const authStatus =
          this.props.plannerSetting && this.props.plannerSetting.authStatus
            ? this.props.plannerSetting.authStatus
            : null;

        return (
          <li
            key={key}
            className="admin-pc-contents-detail-pane__body__item-list__item"
          >
            <Label text={msg()[msgkey]}>
              <AuthStatusField
                authStatus={authStatus}
                isEditing={isEditing}
                onClickAuthButton={this.props.onClickAuthButton}
                onClickRemoteSiteSettingButton={
                  this.props.onClickRemoteSiteSettingButton
                }
              />
            </Label>
          </li>
        );
      }
      return null;
    } else {
      const isDetailItemDisabled = !isEditing;
      const tmpEditRecord = this.props.plannerSetting || {};

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
  }

  renderItemList(configList: any[]) {
    return (
      <ul className={`${ROOT}__item-list`}>
        {configList.map((config) => {
          return config.section
            ? this.renderSection(config)
            : this.renderItem(config);
        })}
      </ul>
    );
  }

  render() {
    return (
      <div className={ROOT}>
        <DetailPaneButtonsHeader
          title={msg().Admin_Lbl_FunctionSettings}
          mode={this.props.mode}
          isSinglePane
          onClickEditButton={this.props.onClickEditButton}
          onClickUpdateButton={this.props.onClickUpdateButton}
          onClickCancelButton={this.props.onClickCancelEditButton}
        />
        <div className={`${ROOT}__body`}>
          {this.renderItemList(masterConfigList.base)}
        </div>
      </div>
    );
  }
}
