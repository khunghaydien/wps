import React from 'react';

import classNames from 'classnames';

import { Text } from '../../core';

import './TabNav.scss';

type tabConfigItem = {
  component: any;
  label: string;
  disabled?: boolean;
  id?: string;
  isApproval?: boolean;
};

type Props = {
  tabLabelContainerClass?: string;
  headerContainerClass?: string;
  config: Array<tabConfigItem>;
  selectedTab: number;
  onChangeTab: (arg0: number, arg1?: string, arg2?: boolean) => void;
};

const ROOT = 'ts-tabs-nav';

export default class TabsNav extends React.Component<Props> {
  isActiveMenu(tabIndex: number) {
    return this.props.selectedTab === tabIndex;
  }

  changeMenu(tabIndex: number, id?: string, isApproval?: boolean) {
    this.props.onChangeTab(tabIndex, id, isApproval);
  }

  renderTabItems(tabs: Array<any>): any {
    if (!tabs) {
      return null;
    }

    const tabItems = tabs.map((tab: any, index: number) => {
      const activeClass = this.isActiveMenu(index) ? ' active' : '';
      const disabledClass = tab.disabled ? ' disabled' : '';

      return (
        <button
          type="button"
          key={index}
          className={`${ROOT}__item${activeClass}${disabledClass}`}
          onClick={() => this.changeMenu(index, tab.id, tab.isApproval)}
          data-testid={`${ROOT}-${tab.label.replace(/\s/g, '')}`}
          disabled={tab.disabled}
        >
          <div
            className={classNames({
              [`${ROOT}__item-inner-container`]: true,
              [this.props.tabLabelContainerClass]:
                !!this.props.tabLabelContainerClass,
            })}
          >
            <Text size="large" color="secondary">
              {tab.label}
            </Text>
            {tab.icon}
          </div>
        </button>
      );
    });
    return (
      <div
        className={classNames({
          [`${ROOT}__header`]: true,
          [this.props.headerContainerClass]: !!this.props.headerContainerClass,
        })}
      >
        {tabItems}
      </div>
    );
  }

  // render SelectedComponent.
  renderContent(tabs: any) {
    const SelectedComponent = tabs[this.props.selectedTab].component;
    return SelectedComponent;
  }

  render() {
    const { config } = this.props;

    return (
      <div className={ROOT}>
        {this.renderTabItems(config)}
        <div className={`${ROOT}__content`}>{this.renderContent(config)}</div>
      </div>
    );
  }
}
