import React from 'react';

import { Text } from '../../core';

import './TabNav.scss';

type tabConfigItem = {
  component: any;
  label: string;
  disabled?: boolean;
};

type Props = {
  config: Array<tabConfigItem>;
  selectedTab: number;
  onChangeTab: (arg0: number) => void;
};

const ROOT = 'ts-tabs-nav';

export default class TabsNav extends React.Component<Props> {
  isActiveMenu(tabIndex: number) {
    return this.props.selectedTab === tabIndex;
  }

  changeMenu(tabIndex: number) {
    this.props.onChangeTab(tabIndex);
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
          onClick={() => this.changeMenu(index)}
          data-testid={`${ROOT}-${tab.label.replace(/\s/g, '')}`}
          disabled={tab.disabled}
        >
          <Text size="large" color="secondary">
            {tab.label}
          </Text>
        </button>
      );
    });
    return <div className={`${ROOT}__header`}>{tabItems}</div>;
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
