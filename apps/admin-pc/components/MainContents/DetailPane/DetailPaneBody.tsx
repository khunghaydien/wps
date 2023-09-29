import React from 'react';

import msg from '../../../../commons/languages';

import * as ConfigUtil from '../../../utils/ConfigUtil';

import DetailItem from './DetailItem';
import DetailSection from './DetailSection';

import './DetailPaneBody.scss';

const ROOT = 'admin-pc-contents-detail-pane__body';

type Props = {
  checkboxes: any;
  configList: Array<any>;
  baseValueGetter: any;
  historyValueGetter: any;
  disabled: boolean;
  getOrganizationSetting: any;
  onChangeCheckBox: any;
  onChangeDetailItem: any;
  sfObjFieldValues: any;
  tmpEditRecord: any;
  tmpEditRecordBase?: any;
  renderDetailExtraArea?: any;
  disabledValidDateTo?: boolean;
  useFunction: any;
  sections?: any;
  mode?: any;
  component?: React.ReactNode;
};

export default class DetailPaneBody extends React.Component<Props> {
  static defaultProps = {
    renderDetailExtraArea: null,
    disabledValidDateTo: false,
  };

  constructor(props) {
    super(props);
    this.state = { sections: {} };
  }

  UNSAFE_componentWillMount() {
    const sections = {};
    this.getSectionKey(this.props.configList, sections);
    this.setState({ sections });
  }

  onClickSectionTitle(section) {
    this.setState((prevState) => {
      // @ts-ignore
      const sections = prevState.sections;
      sections[section] = !sections[section];
      return { sections };
    });
  }

  getSectionKey(configList, sections) {
    if (!configList) {
      return;
    }
    configList.forEach((config) => {
      if (config.section) {
        this.getSectionKey(config.configList, sections);
        sections[config.section] = config.defaultOpen || false;
      }
    });
  }

  renderSection(config) {
    if (
      !ConfigUtil.isEffective(
        config,
        this.props.useFunction,
        this.props.baseValueGetter,
        this.props.historyValueGetter
      )
    ) {
      return null;
    }

    // @ts-ignore
    const isClosed = this.state.sections[config.section];
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
        {this.renderItemList(config.configList, config.section)}
      </DetailSection>
    );
  }

  renderItem(config, key) {
    let disabled = this.props.disabled;

    const { enableMode } = config;
    const isAlwaysDisabled =
      (typeof enableMode === 'string' && enableMode !== this.props.mode) ||
      (Array.isArray(enableMode) && enableMode.indexOf(this.props.mode) < 0);

    if (!disabled && isAlwaysDisabled) {
      disabled = true;
    }

    return (
      <DetailItem
        key={key}
        checkboxes={this.props.checkboxes}
        config={config}
        baseValueGetter={this.props.baseValueGetter}
        historyValueGetter={this.props.historyValueGetter}
        disabled={disabled}
        getOrganizationSetting={this.props.getOrganizationSetting}
        onChangeCheckBox={this.props.onChangeCheckBox}
        onChangeDetailItem={this.props.onChangeDetailItem}
        sfObjFieldValues={this.props.sfObjFieldValues}
        tmpEditRecord={this.props.tmpEditRecord}
        tmpEditRecordBase={this.props.tmpEditRecordBase}
        disabledValidDateTo={this.props.disabledValidDateTo}
        useFunction={this.props.useFunction}
        mode={this.props.mode}
      />
    );
  }

  renderItemList(configList, key = '') {
    return (
      <ul className={`${ROOT}__item-list`}>
        {configList.map((config, idx) => {
          return config.section
            ? this.renderSection(config)
            : this.renderItem(config, `${key}${idx}`);
        })}
      </ul>
    );
  }

  renderDetailExtraArea() {
    if (this.props.renderDetailExtraArea) {
      return this.props.renderDetailExtraArea(this.props.disabled);
    }
    return null;
  }

  renderDetailArea() {
    return (
      <>
        {this.renderItemList(this.props.configList)}
        {this.renderDetailExtraArea()}
      </>
    );
  }

  render() {
    const { component } = this.props;
    return (
      <div className={ROOT}>
        {(component && this.props.component) || this.renderDetailArea()}
      </div>
    );
  }
}
