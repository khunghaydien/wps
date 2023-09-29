import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/extendedItemPSA';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

import './index.scss';

type Props = {
  actions: Action;
  objectType: string;
  companyId: string;
  searchExtendedItem: Array<Record>;
};

export default class ExtendedItem extends React.Component<Props> {
  componentDidMount() {
    const param = {
      companyId: this.props.companyId,
      objectType: this.props.objectType,
    };
    this.props.actions.getConstantsExtendedItem();
    this.props.actions.searchExtendedItem(param);
  }

  componentDidUpdate(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = {
        companyId: nextProps.companyId,
        objectType: nextProps.objectType,
      };
      this.props.actions.getConstantsExtendedItem(param);
      this.props.actions.searchExtendedItem(param);
    }
  }

  render() {
    const { objectType } = this.props;
    const configList = cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        className={`admin-pc-contents--${objectType}`}
        objectType={objectType}
        componentKey="extendedItem"
        configList={configList}
        itemList={this.props.searchExtendedItem}
        showCloneButton
        hideDeleteDetailButton
        {...this.props}
      />
    );
  }
}
